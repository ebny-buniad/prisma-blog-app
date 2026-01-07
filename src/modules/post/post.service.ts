import { Post, Prisma } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createPost = async (data: Omit<Post, 'id' | 'createdAt' | 'updateAt' | 'authorId'>, userId: string) => {
    const result = await prisma.post.create({
        data: {
            ...data,
            authorId: userId
        }
    });
    return result
}

const getAllPost = async (searchText: string | undefined) => {
    const result = await prisma.post.findMany({
        where: {
            OR: [
                {
                    title: {
                        contains: searchText as string,
                        mode: "insensitive"
                    }
                },
                {
                    content: {
                        contains: searchText as string,
                        mode: "insensitive"
                    }
                },
                {
                    tags: {
                        has: searchText as string
                    }
                }
            ]
        }
    });
    return result;
}

export const postServices = {
    createPost,
    getAllPost
}