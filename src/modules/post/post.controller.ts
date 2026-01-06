import { Request, Response } from "express"
import { postServices } from "./post.service";

const createPost = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        if(!user){
            return res.status(400).json({
                error: "Unauthorized"
            })
        }
        const data = req.body;
        const result = await postServices.createPost(data, user.id as string);
        res.status(201).json(result)
    }
    catch (error) {
        res.status(400).json({
            error: "Post creation failed",
            details: error
        })
    }
}

export const postController = {
    createPost
}