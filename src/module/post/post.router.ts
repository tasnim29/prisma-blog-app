import { NextFunction, Request, Response, Router } from "express";
import { postController } from "./post.controller";
import { auth, userRole } from "../../middlewares/auth";

const router = Router();

router.post("/", auth(userRole.USER), postController.createPost);
router.get("/", postController.getPost);
router.get("/:postId",postController.getPostById)

export const postRouter: Router = router;
