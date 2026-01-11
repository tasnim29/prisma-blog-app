import { Request, Response } from "express";
import { commentService } from "./comment.service";

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

export const commentController = {
    createComment,
    getCommentById
}