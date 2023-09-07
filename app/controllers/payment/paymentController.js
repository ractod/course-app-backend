import PaymentModel from "../../models/payment.js"
import UserModel from "../../models/user.js"

class PaymentContoller {
   async createPayment(req, res) {
      try {
         const user = await UserModel.findById(req.userId).populate("cart.items purchasedCourses")
         // console.log(user)
         if(!user.cart.items.length) {
            return res.status(400).json({ message: "سبد خرید شما خالی است" })
         }
   
         const payment = await PaymentModel.create({
            user: user._id,
            amount: user.cart.priceToPay,
            courses: user.cart.items.map(course => course._id)
         })
         user.purchasedCourses.push(...user.cart.items)
   
         for (const item of user.cart.items) {
            const mentor = await UserModel.findById(item.mentor)
            const stats = mentor.mentorData.stats
            const studentIndex = stats.students.findIndex(student => student.student.equals(user._id))
            const soldCourseIndex = stats.soldCourses.findIndex(course => course.course.equals(item._id))
            
            if(studentIndex != -1) {
               stats.students[studentIndex].purchasedCourses.push(item) 
            } else {
               stats.students.push({ student: user._id, purchasedCourses: [item] })
            }
   
            if(soldCourseIndex != -1) {
               stats.soldCourses[soldCourseIndex].quanity++
            } else {
               stats.soldCourses.push({ course: item._id, quanity: 1 })
            }
   
            stats.totalSaleQuanity++
            await mentor.save()
         }
   
         user.cart = {
            items: [],
            totalPrice: 0,
            coupons: []
         }
         user.payments.push(payment._id)
   
         await user.save()
   
         res.status(200).json({ message: "پرداخت با موفقیت انجام شد", })
      } catch(error) {
         console.log(error)
         res.status(500).json({ message: "خطلا در برقراری ارتباط با سرور" })
      }
   }
}

export default new PaymentContoller