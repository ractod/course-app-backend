import { Schema, model } from "mongoose";

const CouponSchema = new Schema({
   code: { type: String, required: true, unique: true },
   discount: { type: String, required: true },
   expireDate: { type: Date },
   type: { type: String, enum: ["percentage", "fixed_amount"], required: true },
   inStockCount: { type: Number, required: true },
   courses: [{ type: Schema.Types.ObjectId, ref: "Course" }],
})

const CouponModel = model("Coupon", CouponSchema)

export default CouponModel