import express from "express"
import { isAuthMiddleware } from "../../middlewares/middlewares.js"
import PaymentController from "../controllers/payment/paymentController.js"

const router = express.Router()

router.post("/", isAuthMiddleware, PaymentController.createPayment)

export default router