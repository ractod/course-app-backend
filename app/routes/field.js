import express from "express"
import Fieldscontroller from "../controllers/fileds/FieldsController.js"

const router = express.Router()

router.get("/", Fieldscontroller.getAllFileds)

export default router