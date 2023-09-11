import express from "express";
// controler
import userController from "../controllers/user/userController.js";
// middlewares
import {
   isAuthMiddleware,
   validatorMiddleware,
} from "../../middlewares/middlewares.js";
// validators
import {
   signupValidator,
   signinValidator,
   updateUserProfileValidator,
   upgradeToMentorValidator,
} from "../../validators/user.js";
import { verifyToken } from "../../utils/auth.js";
import multer from "multer";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() })

function decideMiddleware(req, res, next) {
   const token = req.headers?.authorization?.split(" ")[1];
   const verifiedtoken = verifyToken(token);
   console.log({token})

   if (verifiedtoken) {
      req.userId = verifiedtoken._id;
   }

   next()
}

router.post(
   "/auth/signup",
   validatorMiddleware(signupValidator),
   userController.signup
);

router.post(
   "/auth/signin",
   validatorMiddleware(signinValidator),
   userController.signin
);

router.get(
   "/auth/signout", 
   userController.signout
);

router.get(
   "/auth/session", 
   userController.getSession
);

router.post(
   "/upgrade-to-mentor",
   isAuthMiddleware,
   validatorMiddleware(upgradeToMentorValidator),
   userController.upgradeToMentor
);

router.patch(
   "/",
   isAuthMiddleware,
   validatorMiddleware(updateUserProfileValidator),
   userController.updateUserPorfile
);

router.get(
   "/role",
   isAuthMiddleware,
   userController.getUserRole
);

router.get(
   "/",
   decideMiddleware,
   userController.getUser
)

router.patch(
   "/avatar",
   isAuthMiddleware,
   upload.single("avatar"),
   userController.updateAvatar
)

export default router;
