import { Schema, model } from "mongoose";

const PaymentSchema = new Schema({
   user: { type: Schema.Types.ObjectId, ref: "User" },
   amount: { type: Number, required: true },
   date: { type: Date, default: () => Date.now() },
   courses: [{ type: Schema.Types.ObjectId, ref: "Course" }]
})

const PaymentModel = model("Payment", PaymentSchema)

export default PaymentModel