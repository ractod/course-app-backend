import { Schema, model } from "mongoose";

const RateSchema = new Schema({
   totalAmount: { type: Number, default: 0 },
   totalRate: { type: Number, default: 0 },
   avrage: { type: Number, default: 0 }
})

const DetailsSchema = new Schema({
   description: { type: String, required: true },
   duration: { type: String, required: true },
   rate: { type: RateSchema, default: {} }
})

const SessionSchema = new Schema({
   title: { type: String, required: true },
   description: { type: String, required: false },
   duration: { type: Number, required: true },
   videoLink: { type: String },
   isFree: { type: Boolean, default: false }
})

const CourseSchema = new Schema({
   title: { type: String, required: true },
   details: { type: DetailsSchema },
   category: { type: Schema.Types.ObjectId, ref: "Category" },
   sessions: [{ type: SessionSchema, required: true }],
   mentor: { type: Schema.Types.ObjectId, ref: "User", index: true },
   likes: { type: Number, default: 0 },
   price: { type: Number, required: true },
   discount: { type: Number, default: 0 },
   offPrice: { type: Number, default: 0 }, // price - discount
   status: { type: String, enum: ["verified", "rejected", "in_progress", "deleted"], default: "in_progress" },
   isLiked: { type: Boolean, default: false },
   isSaved: { type: Boolean, default: false },
   statusMessage: { type: String,  default: "" },
   cover: { type: String, required: true },
   date: { type: Date, default: () => Date.now(), immutable: false },
}, {
   timestamps: true
})

CourseSchema.index({
   title: "text"
})

const CourseModel = model("Course", CourseSchema)

export default CourseModel