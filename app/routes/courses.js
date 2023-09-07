import express from "express";
import CoursesContoller from "../controllers/courses/coursesContoller.js";
import { isAuthMiddleware } from "../../middlewares/middlewares.js";
import { verifyToken } from "../../utils/auth.js";

const router = express.Router();

function decideMiddleware(req, res, next) {
  const token = req.cookies.token;
  const verifiedtoken = verifyToken(token);

  if (verifiedtoken) {
    req.userId = verifiedtoken._id;
  }

  next();
}

router.get("/", decideMiddleware, CoursesContoller.getAllCourses);
router.get("/:courseId", decideMiddleware, CoursesContoller.getOneCourse);
router.patch("/like/:courseId", isAuthMiddleware, CoursesContoller.likeCourse);
router.patch("/save/:courseId", isAuthMiddleware, CoursesContoller.saveCourse);

export default router;
