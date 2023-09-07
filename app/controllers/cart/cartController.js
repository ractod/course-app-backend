import getUpdatedCart from "../../../utils/getUpdatedCart.js"
import CouponModel from "../../models/coupon.js"
import CourseModel from "../../models/course.js"
import UserModel from "../../models/user.js"

class CartController {
   async addItem(req, res) {
      try {
         const { courseId } = req.body
         const course = await CourseModel.findById(courseId)
         const user = await UserModel.findById(req.userId)

         if(user.cart.items.includes(courseId)) {
            return res.status(400).json({ message: "این دوره قبلا به سبد خرید اضافه شده است" })
         }
         if(user.purchasedCourses.includes(courseId)) {
            return res.status(400).json({ message: "شما قبلا این دوره را خریداری کرده اید" })
         }

         await UserModel.findByIdAndUpdate(req.userId, {
            $push: { "cart.items": courseId },
            $inc: { "cart.totalPrice": +(course.offPrice ? course.offPrice : course.price) }
         })
         const cart = await getUpdatedCart(req)
   
         res.status(200).json({ message: "دوره با موفقیت به سبد خرید شما اضافه شد", cart })
      } catch(error) {
         console.log(error)
         res.status(500).json({ message: "خطلا در برقراری ارتباط با سرور" });
      }  
   }

   async removeItem(req, res) {
      try {
         const { courseId } = req.body
         const user = await UserModel.findById(req.userId)
         console.log(courseId)
         user.cart.items.pull(courseId)
         await user.save()
         const updatedCart = await getUpdatedCart(req)

         res.status(200).json({ message: "دوره با موفقیت از سبد خرید شما حذف شد", cart: updatedCart })
      } catch {
         res.status(500).json({ message: "خطلا در برقراری ارتباط با سرور" });
      }
   }

   async getCart(req, res) {
      try {
         const cart = await getUpdatedCart(req)
         res.status(200).json(cart ? cart : {
            items: [],
            totalPrice: 0,
            coupons: []
         })
      } catch(error) {
         console.log(error)
         res.status(500).json({ message: "خطلا در برقراری ارتباط با سرور" });
      }
   }

   async clearCart(req,res) {
      try {
         const user = await UserModel.findByIdAndUpdate(req.userId, {
            cart: {
               items: [],
               totalPrice: 0,
            }
         }, { new: true })
         
         res.status(200).json({ message: "سبد خرید شما با موفقیت پاک شد", cart: user.cart })
      } catch {
         res.status(500).json({ message: "خطلا در برقراری ارتباط با سرور" });
      }
   }

   async applyCoupon(req, res) {
      try {
         const { couponCode } = req.body
         const coupon = await CouponModel.findOne({ code: couponCode })
         const user = await UserModel.findById(req.userId).populate("cart.items")

         if(!coupon) {
            return res.status(400).json({ message: "کد تخفیف وارد شده معتبر نیست" })
         }
         if(coupon.expireDate <= Date.now()) {
            return res.status(400).json({ message: "کد تخفیف منقضی شده است" })
         }
         if(user.cart.coupons.includes(coupon._id)) {
            return res.status(400).json({ message: "شما از این کد تخفیف قبلا استفاده کرده اید"})
         }

         const cartAllowedItems = user.cart.items.filter(item => coupon.courses.includes(item._id))
         if(cartAllowedItems.length === 0) {
            return res.status(400).json({ message:"این کد تخفیف شامل هیچ یک از دوره های سبد خرید شما نمی شود" })
         }

         if(coupon.inStockCount === 0) {
            return res.status(400).json({ message: "کد تخفیف مورد نظر تمام شده است" })
         }

         coupon.inStockCount--
         user.cart.coupons.push(coupon._id)
         await user.save()
         await coupon.save()
         const updatedCart = await getUpdatedCart(req)

         res.status(200).json({ message: "کد تخفیف با موفقیت اعمال شد", cart: updatedCart })
      } catch(error) {
         console.log(error)
         res.status(500).json({ message: "خطلا در برقراری ارتباط با سرور" });
      }
   }

   async deleteCoupon(req, res) {
      try {
         const coupon = await CouponModel.findById(req.body.couponId)
         const user = await UserModel.findById(req.userId).populate("cart.items")

         coupon.inStockCount++
         user.cart.coupons.pull(coupon._id)
         await user.save()
         await coupon.save()
         const updatedCart = await getUpdatedCart(req)

         res.status(200).json({ message: "کد تخفیف با موفقیت حذف شد", cart: updatedCart }) 
      } catch(error) {
         console.log(error)
         res.status(500).json({ message: "خطلا در برقراری ارتباط با سرور" });
      }
   }
}

export default new CartController