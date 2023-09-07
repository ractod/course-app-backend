import { Schema, model } from "mongoose";

const FieldSchema = new Schema({
   title: { type: String, required: true },
   englishTitle: { type: String, required: true },
   status: { type: String, enum: ["active", "deleted"], default: "active" }
})

const FieldModel = model("Field", FieldSchema)

export default FieldModel