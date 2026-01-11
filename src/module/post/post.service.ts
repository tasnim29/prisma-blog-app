import { CommonStatus, Post, PostStatus } from "../../../generated/prisma/client";
import { PostWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";

const createPost = async (
  data: Omit<Post, "id" | "createdAt" | "updatedAt" | "authorId">,
  userId: string
) => {
  const result = await prisma.post.create({
    data: {
      ...data,
      authorId: userId,
    },
  });
  return result;
};

const getPost = async ({
  search,
  tags,
  isFeatured,
  status,
  authorId,
  limit,
  page,
  skip,
  sortBy,
  sortOrder,
}: {
  search?: string | undefined;
  tags: string[] | [];
  isFeatured: boolean | undefined;
  status: PostStatus | undefined;
  authorId: string | undefined;
  limit: number;
  page: number;
  skip: number;
  sortBy: string;
  sortOrder: string;
}) => {
  const andConditions: PostWhereInput[] = [];
  // console.log("before",andConditions)

  if (search) {
    andConditions.push({
      OR: [
        {
          title: {
            contains: search as string,
            mode: "insensitive",
          },
        },
        {
          content: {
            contains: search as string,
            mode: "insensitive",
          },
        },
        {
          tags: {
            has: search as string,
          },
        },
      ],
    });
  }

  if (tags.length > 0) {
    andConditions.push({
      tags: {
        hasEvery: tags as string[],
      },
    });
  }

  if (typeof isFeatured === "boolean") {
    andConditions.push({
      isFeatured: isFeatured,
    });
  }

  if (status) {
    andConditions.push({
      status: status,
    });
  }
  if (authorId) {
    andConditions.push({
      authorId: authorId,
    });
  }

  // console.log("after",andConditions)

  const result = await prisma.post.findMany({
    take: limit,
    skip,
    where: {
      AND: andConditions,
    },
    orderBy: {
      [sortBy]: sortOrder,
    },
    include:{
      _count:{
        select:{
          comments:true
        }
      }
    }
  });

  const total = await prisma.post.count({
    where: {
      AND: andConditions,
    },
  });

  return {
    data: result,
    pagination: {
      total,
      page,
      limit,
      totalPageS: Math.ceil(total / limit),
    },
  };
};

const getPostById = async (postId: string) => {
  return await prisma.$transaction(async (tx) => {
    // update
    await tx.post.update({
      where: {
        id: postId,
      },
      data: {
        views: {
          increment: 1,
        },
      },
    });
    // get single data
    const postData = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      include:{
        comments:{
          where:{
            parentId:null,
            status:CommonStatus.APPROVED
          },
          orderBy:{
            createdAt:"desc"
          },
          include:{
            replies:{
              orderBy:{
                createdAt:"asc"
              },
              include:{
                replies:{
                  orderBy:{
                    createdAt:"asc"
                  }
                }
              }
            }
          }
        },
        _count:{
          select:{
            comments:true
          }
        }
        
      }
    });
    return postData;
  });
};

export const postService = {
  createPost,
  getPost,
  getPostById,
};
