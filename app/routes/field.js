import express from "express"
import Fieldscontroller from "../controllers/fileds/Fieldscontroller.js"

const router = express.Router()

router.get("/", Fieldscontroller.getAllFileds)

export default router