import express from "express"
import { postRouet } from "./modules/post/post.router";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
const app = express();
app.all('/api/auth/{*any}', toNodeHandler(auth));
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.use("/posts", postRouet)

export default app;