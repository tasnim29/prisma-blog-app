import { Router } from "express";
import { postController } from "./post.controller";
import { auth, userRole } from "../../middlewares/auth";

const router = Router();

router.post("/", auth(userRole.USER,userRole.ADMIN), postController.createPost);
router.get("/", postController.getPost);

router.get("/myPosts",auth(userRole.ADMIN,userRole.USER),postController.getMyPosts)

router.get("/stats",postController.getStats)

router.get("/:postId",postController.getPostById)

router.patch("/:postId",auth(userRole.USER,userRole.ADMIN),postController.updateMyPost)

router.delete("/:postId",auth(userRole.USER,userRole.ADMIN),postController.deletePost)







export const postRouter: Router = router;
