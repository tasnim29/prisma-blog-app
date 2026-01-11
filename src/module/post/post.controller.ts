import { Request, Response } from "express";
import { postService } from "./post.service";
import { PostStatus } from "../../../generated/prisma/enums";
import paginationSortingHelper from "../../Helpers/paginationSortingHelper";

const createPost = async (req: Request, res: Response) => {
  try {
    console.log(req.user);
    if (!req.user) {
      return res.status(401).json({
        error: "No user",
      });
    }

    const result = await postService.createPost(
      req.body,
      req.user.id as string
    );
    res.status(201).json({
      result,
    });
  } catch (error: any) {
    res.status(401).json({
      error: error,
    });
  }
};

const getPost = async (req: Request, res: Response) => {
  try {
    const { search } = req.query;
    //    console.log("searched thing",search)
    // console.log("before",req.query.tags)
    const searchText = typeof search === "string" ? search : undefined;
    const tags = req.query.tags ? (req.query.tags as string).split(",") : [];

    // const isFeatured = req.query.isFeatured? req.query.isFeatured ==="true":false (this logic is wrong)

    const isFeatured =
      typeof req.query.isFeatured === "string"
        ? req.query.isFeatured === "true"
          ? true
          : req.query.isFeatured === "false"
          ? false
          : undefined
        : undefined;

    const status = req.query.status as PostStatus | undefined;

    const authorId = req.query.authorId as string | undefined;

    // console.log(typeof isFeatured)



    const {limit,page,skip,sortBy,sortOrder}=paginationSortingHelper(req.query)

    // console.log("after",tags)
    const result = await postService.getPost({
      search: searchText,
      tags,
      isFeatured,
      status,
      authorId,
      limit,
      page,
      skip,
      sortBy,
      sortOrder
    });

    res.status(201).json({
       result,
    });
  } catch (error) {
    res.status(401).json({
      error: error,
    });
  }
};

const getPostById = async (req: Request, res: Response) =>{
  const {postId}= req.params
  const result = await postService.getPostById(postId as string)
  try {
    res.status(200).json({
    success:true,
    data:result
  })
  } catch (error) {
    res.status(401).json({
      error: error,
    });
  }
}

export const postController = {
  createPost,
  getPost,
  getPostById
};
