import { NextFunction, Request, Response } from "express"
import { auth as betterAuth } from "../lib/auth"

export enum UserRole {
    USER = "USER",
    ADMIN = "ADMIN"
}

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string,
                email: string,
                role: string
                emailVerified: boolean
            }
        }
    }
}

const auth = (...roles: UserRole[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        // Get user session
        const session = await betterAuth.api.getSession({
            headers: req.headers as any
        })
        console.log(session)
        req.user = {
            id: session?.user.id as string,
            email: session?.user.email as string,
            role: session?.user.role as string,
            emailVerified: session?.user.emailVerified as boolean
        }

        if (roles.length && !roles.includes(req.user.role as UserRole)) {
            return res.status(403).json({
                success: false,
                message: "Forbidden!"
            })
        }
        next();
    }
}

export default auth;