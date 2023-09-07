import express from "express"
import categoriesController from "../controllers/categories/categoriesController.js"

const router = express.Router()

router.get("/", categoriesController.getAllCategories)

export default router