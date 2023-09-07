import express from "express";
import { isAuthMiddleware } from "../../middlewares/middlewares.js";
import CartController from "../controllers/cart/cartController.js";
import { verifyToken } from "../../utils/auth.js";

const router = express.Router();

function decideMiddleware(req, res, next) {
  const token = req.cookies.token;
  const verifiedtoken = verifyToken(token);

  if (verifiedtoken) {
    req.userId = verifiedtoken._id;
  }

  next()
}


router.post("/add", isAuthMiddleware, CartController.addItem)
router.post("/remove", isAuthMiddleware, CartController.removeItem)
router.get("/", decideMiddleware, CartController.getCart)
router.post("/coupon/apply", isAuthMiddleware, CartController.applyCoupon)
router.post("/coupon/remove", isAuthMiddleware, CartController.deleteCoupon)
router.delete("/clear", isAuthMiddleware, CartController.clearCart)

export default router