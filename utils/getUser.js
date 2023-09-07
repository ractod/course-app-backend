import UserModel from "../app/models/user.js";
import getUpdatedCart from "./getUpdatedCart.js";

const getUser = async (req) => {
  const user = await UserModel.findOne({ _id: req.userId, status: { $ne: "deleted" }})
    .populate({
      path: "purchasedCourses",
      model: "Course",
      populate: "mentor category",
    })
    .populate({
      path: "savedCourses",
      model: "Course",
      populate: "mentor category",
    })
    .populate({
      path: "payments",
      model: "Payment",
      populate: { path: "courses", select: "title" },
    })
    .populate({
      path: "mentorData.stats.students.purchasedCourses",
      model: "Course",
      select: "title",
    })
    .populate({
      path: "mentorData.stats.students.student",
      model: "User",
      select: "email fullname",
    })
    .populate({
      path: "mentorData.coupons",
      model: "Coupon",
      populate: {
        path: "courses",
        select: "title",
      },
    })
    .populate("mentorData.fields")
    .populate({
      path: "mentorData.courses",
      model: "Course",
      populate: "category",
    })
  if (user) {
    const cart = await getUpdatedCart(req);
    user.cart = cart;
  }
  return user;
};

export default getUser;
