import { Router } from "express";
import { commentController } from "./comment.controller";
import { auth, userRole } from "../../middlewares/auth";

const router = Router();

router.post("/",auth(userRole.USER,userRole.ADMIN), commentController.createComment);
router.get("/:commentId",commentController.getCommentById)
router.get("/author/:authorId",commentController.getCommentByAuthorId)

router.delete("/:commentId",auth(userRole.ADMIN,userRole.USER),commentController.deleteComment)
router.put("/:commentId",auth(userRole.ADMIN,userRole.USER),commentController.updateComment)
router.patch("/moderate/:commentId",auth(userRole.ADMIN),commentController.moderateData)

export const commentRouter: Router = router;
