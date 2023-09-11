import UserModel from "../app/models/user.js";
import { verifyToken } from "../utils/auth.js";

function isAuthMiddleware(req, res, next) {
   const token = req.headers?.authorization?.split(" ")[1];
   const verifiedtoken = verifyToken(token);

   if (verifiedtoken) {
      req.userId = verifiedtoken._id;
      next();
   } else {
      res.status(401).json({ message: "لطفا وارد حساب کاربری خود شوید" });
   }
}

function validatorMiddleware(validator) {
   return (req, res, next) => {
      console.log(req.body)
      const { error } = validator.validate(req.body);
      if (error) {
         console.log(error)
         return res.status(400).json({ message: "اطلاعات شما صحیح نمی باشد" });
      }
      next();
   };
}

function checkRoleMiddleware(role) {
   return async (req, res, next) => {
      const user = await UserModel.findById(req.userId)
      if(user.role !== role) {
         return res.status(403).json({ message: "شما دسترسی لازم را ندارید" })
      }
      next()
   }
}

export { isAuthMiddleware, validatorMiddleware, checkRoleMiddleware };
