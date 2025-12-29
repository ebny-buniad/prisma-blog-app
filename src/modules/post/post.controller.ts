import { Request, Response } from "express"
import { postServices } from "./post.service";

const createPost = async (req: Request, res: Response) => {
    try {
        const data = req.body;
        const result = await postServices.createPost(data);
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