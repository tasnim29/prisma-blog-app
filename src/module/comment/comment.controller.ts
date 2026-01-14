import { Request, Response } from "express";
import { commentService } from "./comment.service";
import { CommonStatus } from "../../../generated/prisma/enums";

const createComment = async (req: Request, res: Response) => {
  try {
    const user = req.user
   req.body.authorId = user?.id
    const result = await commentService.createComment(req.body);
    res.status(201).json({
      success: true,
      data:result
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      error: error,
    });
  }
};

const getCommentById = async(req: Request, res: Response)=>{
  const {commentId} = req.params;
  try {
    const result = await commentService.getCommentById(commentId as string);
     res.status(200).json({
      success: true,
      data:result
    });

  } catch (error) {
    res.status(401).json({
      success: false,
      error: error,
    });
  }
}

const getCommentByAuthorId = async(req: Request, res: Response)=>{
  const {authorId} = req.params;
  try {
    const result = await commentService.getCommentByAuthorId(authorId as string);
     res.status(200).json({
      success: true,
      data:result
    });

  } catch (error) {
    res.status(401).json({
      success: false,
      error: error,
    });
  }
}

const deleteComment = async(req: Request, res: Response)=>{
  try {
    const userId = req.user?.id
    const {commentId} = req.params
    const result = await commentService.deleteComment(commentId as string,userId as string);
     res.status(200).json({
      success: true,
      message:"Comment deleted successfully",
      data:result
    });

  } catch (error) {
    res.status(401).json({
      success: false,
      error: error,
    });
  }
}
const updateComment = async(req: Request, res: Response)=>{
  try {
    const userId = req.user?.id
    const {commentId} = req.params
    const data = req.body 
    const result = await commentService.updateComment(commentId as string,data ,userId as string);
     res.status(200).json({
      success: true,
      message:"Comment updated successfully",
      data:result
    });

  } catch (error) {
    res.status(401).json({
      success: false,
      error: error,
    });
  }
}
const moderateData = async(req: Request, res: Response)=>{
  try {
  
    const {commentId} = req.params
    const data = req.body 
    const result = await commentService.moderateData(commentId as string,data );
     res.status(200).json({
      success: true,
      message:"Comment moderated successfully",
      data:result
    });

  } catch (error) {
    const errorMessage = (error instanceof Error)?error.message :"Comment Update failed"
    res.status(401).json({
      success: false,
      error: errorMessage,
    });
  }
}



export const commentController = {
    createComment,
    getCommentById,
    getCommentByAuthorId,
    deleteComment,
    updateComment,
    moderateData
}