import { prisma } from "../../lib/prisma"

type CreateCommentPayload ={
    content:string
    authorId:string
    postId:string
    parentId?:string
}

const createComment = async(payload:CreateCommentPayload)=>{

     await prisma.post.findUniqueOrThrow({
        where:{
            id:payload.postId
        }
    })

    if(payload.parentId){
        await prisma.comment.findUniqueOrThrow({
            where:{
                id:payload.parentId
            }
        })
    }

    const result = await prisma.comment.create({
        data:payload
    })
    return result
}

const getCommentById = async(commentId:string)=>{
    return await prisma.comment.findUnique({
        where:{
            id:commentId
        }
    })
}

export const commentService = {
    createComment,
    getCommentById
}