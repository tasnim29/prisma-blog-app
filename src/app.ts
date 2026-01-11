import express, { Application } from "express"
import { postRouter } from "./module/post/post.router";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import cors from "cors"
import { commentRouter } from "./module/comment/comment.router";


const app:Application = express();
app.use(cors({
    origin: process.env.APP_URL || "http://localhost:4000",
    credentials:true
}))

app.all('/api/auth/*splat', toNodeHandler(auth));

app.use(express.json());

app.use("/posts",postRouter)
app.use("/comments",commentRouter)

app.get("/",(req,res)=>(
    res.send("Hello Prisma")
))


export default app