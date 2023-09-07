import express from "express";
import connectDB from "./utils/connectDB.js";
import cookieParser from "cookie-parser";
import userRouter from "./app/routes/user.js"
import fieldRouter from "./app/routes/field.js"
import mentorRouter from "./app/routes/mentor.js"
import coursesRouter from "./app/routes/courses.js"
import cartRouter from "./app/routes/cart.js"
import paymentRouter from "./app/routes/payment.js"
import adminRouter from "./app/routes/admin.js"
import categoriesRouter from "./app/routes/categories.js"
import dotenv from "dotenv"
import cors from "cors"
dotenv.config()
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser(process.env.COOKIE_SECRET))
app.use(cors({ credentials: true, origin: process.env.ORIGIN }))
app.use(cookieParser(process.env.COOKIE_SECRET));

connectDB()

app.use("/user", userRouter)
app.use("/fields", fieldRouter)
app.use("/mentor", mentorRouter)
app.use("/courses", coursesRouter)
app.use("/cart", cartRouter)
app.use("/payment", paymentRouter)
app.use("/admin", adminRouter)
app.use("/categories", categoriesRouter)
app.use("/uploads", express.static("./tmp"))

app.listen(5000, () => {
   console.log("started!!")
})

module.exports = app