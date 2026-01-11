import { Router } from "express";
import { commentController } from "./comment.controller";
import { auth, userRole } from "../../middlewares/auth";

const router = Router();

router.post("/",auth(userRole.USER,userRole.ADMIN), commentController.createComment);
router.get("/commentId",commentController.getCommentById)

export const commentRouter: Router = router;
