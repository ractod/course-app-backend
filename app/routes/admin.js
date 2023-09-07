import express from "express";
import { checkRoleMiddleware, isAuthMiddleware, validatorMiddleware } from "../../middlewares/middlewares.js";
import AdminContoller from "../controllers/admin/adminContoller.js";
import { categoryValidator, fieldValidator, rejectCourseValidator } from "../../validators/admin.js";

const router = express.Router();

router.get(
   "/payments",
   isAuthMiddleware,
   checkRoleMiddleware("admin"),
   AdminContoller.getAllPayments
);

router.get(
   "/courses",
   isAuthMiddleware,
   checkRoleMiddleware("admin"),
   AdminContoller.getCourses
)

router.patch(
   "/courses/reject/:courseId",
   isAuthMiddleware,
   checkRoleMiddleware("admin"),
   validatorMiddleware(rejectCourseValidator),
   AdminContoller.rejectCourse
);

router.patch(
   "/courses/verify/:courseId",
   isAuthMiddleware,
   checkRoleMiddleware("admin"),
   AdminContoller.verifyCourse
);

router.get(
   "/categories",
   isAuthMiddleware,
   checkRoleMiddleware("admin"),
   AdminContoller.getAllCategories
);

router.post(
   "/categories",
   isAuthMiddleware,
   checkRoleMiddleware("admin"),
   validatorMiddleware(categoryValidator),
   AdminContoller.createCategory
);

router.patch(
   "/categories/:categoryId",
   isAuthMiddleware,
   checkRoleMiddleware("admin"),
   validatorMiddleware(categoryValidator),
   AdminContoller.updateCategory
);

router.delete(
   "/categories/:categoryId",
   isAuthMiddleware,
   checkRoleMiddleware("admin"),
   AdminContoller.deleteCategory
);

router.get(
   "/fields",
   isAuthMiddleware,
   checkRoleMiddleware("admin"),
   AdminContoller.getAllFields
);

router.get(
   "/fields",
   isAuthMiddleware,
   checkRoleMiddleware("admin"),
   AdminContoller.getAllFields
);

router.post(
   "/fields",
   isAuthMiddleware,
   checkRoleMiddleware("admin"),
   validatorMiddleware(fieldValidator),
   AdminContoller.createField
);

router.patch(
   "/fields/:fieldId",
   isAuthMiddleware,
   checkRoleMiddleware("admin"),
   validatorMiddleware(fieldValidator),
   AdminContoller.updateField
);

router.delete(
   "/fields/:fieldId",
   isAuthMiddleware,
   checkRoleMiddleware("admin"),
   AdminContoller.deleteField
);

router.get(
   "/users",
   isAuthMiddleware,
   checkRoleMiddleware("admin"),
   AdminContoller.getAllUsers
);

router.delete(
   "/users/:userId",
   isAuthMiddleware,
   checkRoleMiddleware("admin"),
   AdminContoller.deleteUser
);

router.get(
   "/overview",
   isAuthMiddleware,
   checkRoleMiddleware("admin"),
   AdminContoller.getOverview
)

export default router;
