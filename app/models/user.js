import { Schema, model } from "mongoose"

const SocialMediasSchema = new Schema({
   facebook: { type: String, default: "" },
   twitter: { type: String, default: "" }, 
   instagram: { type: String, default: "" }, 
   linkedin: { type: String, default: "" }, 
}, { _id: false })

const SoldCourseSchema = new Schema({
   quanity: { type: String,required: true, default: 1 },
   course: { type: Schema.Types.ObjectId, ref: "Course" },
})

const StudentSchema = new Schema({
   purchasedCourses:  [{ type: Schema.Types.ObjectId, ref: "Course" } ],
   student: { type: Schema.Types.ObjectId, ref: "User" },
})

const StatsSchema = new Schema({
   soldCourses: { type: [SoldCourseSchema], default: [] },
   students: { type: [StudentSchema], default: [] },
   totalSaleQuanity: { type: Number, default: 0 },
})

const RateUserSchema = new Schema({
   rate: { type: Number, required: true },
   userId: { type: Schema.Types.ObjectId }
})

const RateSchema = new Schema({
   totalAmount: { type: Number, default: 0 },
   totalRate: { type: Number, default: 0 },
   avrage: { type: Number, default: 0 },
   users: [RateUserSchema]
})

const MentorSchema = new Schema({
   phoneNumber: { type: String, },
   biography: { type: String, },
   experience: { type: String, },
   fields: [{ type: Schema.Types.ObjectId, ref: "Field", }],
   rate: { type: RateSchema, default: {} },
   socialMedias: { type: SocialMediasSchema, default: {} },
   courses: [{ type: Schema.Types.ObjectId, ref: "Course" }],
   stats: { type: StatsSchema, default: {} },
   coupons: [{ type: Schema.Types.ObjectId, ref: "coupon" }]
})

const CartSchema = new Schema({
   items: [{ type: Schema.Types.ObjectId, ref: "Course" }],
   coupons: [{ type: Schema.Types.ObjectId, ref: "Coupon" } ],
   totalPrice: { type: Number, default: 0 },
   discount: { type: Number, default: 0 },
   priceToPay: { type: Number, default: 0 },
})

const UserSchema = new Schema({
   fullname: { type: String, required: true },
   email: { type: String, required: true, unique: true },
   password: { type: String, required: true },
   mentorData: { type: MentorSchema, default: {} },
   likedCourses: [{ type: Schema.Types.ObjectId, ref: "Course" } ],
   savedCourses: [{ type: Schema.Types.ObjectId, ref: "Course" } ],
   purchasedCourses:  [{ type: Schema.Types.ObjectId, ref: "Course" } ],
   avatar: { type: String, default: "" },
   role: { type: String, enum: ["user", "mentor", "admin"], default: "user" },
   cart: { type: CartSchema, default: {} },
   payments: [{ type: Schema.Types.ObjectId, ref: "Payment" }],
   status: { type: String, enum: ["active", "deleted"], default: "active" }
}, { timestamps: true })

UserSchema.set("toJSON", {
   transform: (doc, ret) => {
      delete ret.password
   }
})

const UserModel = model("User", UserSchema)

export default UserModel