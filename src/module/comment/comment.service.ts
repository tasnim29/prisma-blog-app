import { CommonStatus } from "../../../generated/prisma/enums"
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
        },
        include:{
            post:{
                select:{
                    id:true,
                    title:true
                }
            }
        }
    })
}

const getCommentByAuthorId = async(authorId:string)=>{
    return await prisma.comment.findMany({
        where:{
            authorId:authorId
        },
        orderBy:{createdAt:"desc"},
        include:{
            post:{
                select:{
                    id:true,
                    title:true
                }
            }
        }
    })
}

const deleteComment = async(commentId:string,userId:string)=>{
   await prisma.comment.findFirstOrThrow({
    where:{
        id:commentId,
        authorId:userId
    }
   })

   return await prisma.comment.delete({
    where:{
        id:commentId
    }
   })
}

const updateComment = async(commentId:string,data:{content?:string,status?:CommonStatus},userId:string)=>{
     await prisma.comment.findFirstOrThrow({
    where:{
        id:commentId,
        authorId:userId
    }
   })

   return await prisma.comment.update({
    where:{
        id:commentId,
        authorId:userId
    },
    data
   })
}

const moderateData = async(commentId:string,data:{status:CommonStatus})=>{
    const commentData = await prisma.comment.findFirstOrThrow({
        where:{
            id:commentId
        }
    })

    if(commentData.status === data.status){
        throw new Error(`the status ${data.status} is already set`)
    }

    return await prisma.comment.update({
        where:{
            id:commentId
        },
        data
    })
}

export const commentService = {
    createComment,
    getCommentById,
    getCommentByAuthorId,
    deleteComment,
    updateComment,
    moderateData
}