import express from "express";
import { couponValidator, courseValidator, rateValidator, socialMediasValidator, updateProfileValidator } from "../../validators/mentor.js";
import mentorController from "../controllers/mentor/mentorController.js";
import { checkRoleMiddleware, isAuthMiddleware, validatorMiddleware } from "../../middlewares/middlewares.js";
import multer from "multer";


const router = express.Router();
const upload = multer({ dest: "tmp/", fileFilter: (req, file, cb) => {
   if(file.fieldname === "cover") {
      if(!file.mimetype.startsWith("image")) {
         cb(new Error("file type"), false)
      }
   } else if(!file.mimetype.startsWith("video")) {
      cb(new Error("file type"), false)
   }
   cb(null, true)
}, preservePath: true})

router.post(
   "/profile",
   isAuthMiddleware,
   checkRoleMiddleware("mentor"),
   validatorMiddleware(updateProfileValidator),
   mentorController.updateProfile
);

router.post(
   "/social-medias",
   isAuthMiddleware,
   checkRoleMiddleware("mentor"),
   validatorMiddleware(socialMediasValidator),
   mentorController.updateSocialMedias
)

router.post(
   "/courses",
   isAuthMiddleware,
   checkRoleMiddleware("mentor"),
   upload.any(),
   validatorMiddleware(courseValidator),
   mentorController.createCourse
);

router.patch(
   "/courses/:courseId",
   isAuthMiddleware,
   checkRoleMiddleware("mentor"),
   upload.any(),
   validatorMiddleware(courseValidator),
   mentorController.updateCourse
);

router.delete(
   "/courses/:courseId",
   isAuthMiddleware,
   checkRoleMiddleware("mentor"),
   mentorController.deleteCourse
);

router.put(
   "/rate/:mentorId",
   isAuthMiddleware,
   validatorMiddleware(rateValidator),
   mentorController.rate
);

router.post(
   "/coupons",
   isAuthMiddleware,
   checkRoleMiddleware("mentor"),
   validatorMiddleware(couponValidator),
   mentorController.createCoupon
);

router.patch(
   "/coupons/:couponId",
   isAuthMiddleware,
   checkRoleMiddleware("mentor"),
   validatorMiddleware(couponValidator),
   mentorController.updateCoupon
);

router.delete(
   "/coupons/:couponId",
   isAuthMiddleware,
   checkRoleMiddleware("mentor"),
   mentorController.deleteCoupon
);

router.get("/list", mentorController.getAllMentors)

router.get("/:mentorId", mentorController.getOneMentor)

export default router;
