import { Schema, model } from "mongoose";

const CategorySchema = new Schema({
   title: { type: String, required: true },
   englishTitle: { type: String, required: true },
   status: { type: String, enum: ["active", "deleted"], default: "active" }
})

const CategoryModel = model("Category", CategorySchema)

export default CategoryModel