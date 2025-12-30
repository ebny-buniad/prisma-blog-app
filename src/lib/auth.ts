import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import nodemailer from "nodemailer"
// If your Prisma file is located elsewhere, you can change the path
import { prisma } from "./prisma";

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.APP_USER,
        pass: process.env.APP_PASS
    },
});

const verificationEmailTemplate = (verificationEmail: string, userName = "User") => {
    return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Email Verification</title>
    <style>
      body {
        margin: 0;
        padding: 0;
        background-color: #f4f6f8;
        font-family: Arial, Helvetica, sans-serif;
      }
      .container {
        max-width: 600px;
        margin: 40px auto;
        background: #ffffff;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      }
      .header {
        background: #0f172a;
        padding: 20px;
        text-align: center;
        color: #ffffff;
      }
      .content {
        padding: 30px;
        color: #334155;
        line-height: 1.6;
      }
      .btn {
        display: inline-block;
        margin: 20px 0;
        padding: 14px 24px;
        background: #2563eb;
        color: #ffffff !important;
        text-decoration: none;
        border-radius: 6px;
        font-weight: bold;
      }
      .footer {
        padding: 20px;
        text-align: center;
        font-size: 12px;
        color: #64748b;
        background: #f1f5f9;
      }
      .link {
        word-break: break-all;
        color: #2563eb;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Prisma Blog</h1>
      </div>

      <div class="content">
        <p>Hi <strong>${userName}</strong>,</p>

        <p>
          Thank you for creating an account with <strong>Prisma Blog</strong>.
          Please verify your email address by clicking the button below.
        </p>

        <p style="text-align: center;">
          <a href="${verificationEmail}" class="btn">Verify Email</a>
        </p>

        <p>
          If the button doesn’t work, copy and paste the following link into your browser:
        </p>

        <p class="link">${verificationEmail}</p>

        <p>
          This link will expire soon for security reasons.  
          If you didn’t create an account, you can safely ignore this email.
        </p>

        <p>Thanks,<br />Prisma Blog Team</p>
      </div>

      <div class="footer">
        © ${new Date().getFullYear()} Prisma Blog. All rights reserved.
      </div>
    </div>
  </body>
  </html>
  `;
};


export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    trustedOrigins: [process.env.APP_URL!],
    user: {
        additionalFields: {
            role: {
                type: "string",
                defaultValue: "USER",
                required: false
            },
            phone: {
                type: "string",
                required: false
            },
            status: {
                type: "string",
                defaultValue: "ACTIVE",
                required: false
            }
        }
    },
    emailAndPassword: {
        enabled: true,
        autoSignIn: false,
        requireEmailVerification: true
    },
    emailVerification: {
        sendOnSignUp: true,
        sendVerificationEmail: async ({ user, url, token }, request) => {
            try {
                const verificationEmail = `${process.env.APP_URL}/verify-email?token=${token}`
                const info = await transporter.sendMail({
                    from: '"Prisma Blog" <prismablog@ph.com>',
                    to: user?.email,
                    subject: "Please verify your email",
                    html: verificationEmailTemplate(verificationEmail, user.name),
                });
                console.log("Message sent:", info.messageId);
            }
            catch (error) {
                console.log(error)
                throw error;
            }

        },
    },
    socialProviders: {
        google: { 
            clientId: process.env.GOOGLE_CLIENT_ID as string, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
        }, 
    },
});