import UserModel from "../app/models/user.js"

async function getUpdatedCart(req) {
   const user = await UserModel.findById(req.userId).populate({
      path: "cart.items",
      model: "Course",
      select: "title cover price offPrice discount",
      populate: { path: "mentor", model: "User", select: "fullname avatar" },
   }).populate({
      path: "cart.coupons",
      populate: { path: "courses", select: "title", model: "Course" },
      model: "Coupon"
   })
   let totalPrice = user.cart.items.reduce((acc, cur) => {
      return acc + cur.price
   }, 0)
   let discount = user.cart.items.reduce((acc, cur) => {
      return acc + (cur.discount ? cur.discount : 0)
   }, 0)
   
   user.cart.coupons.forEach(coupon => {
      const cartAllowedItems = user.cart.items.filter(item => {
         return coupon.courses.some(course => course._id.equals(item._id))
      })
      
      if(coupon.type === "percentage") {
         discount += cartAllowedItems.reduce((acc, cur) => {
            const price = cur.offPrice ? cur.offPrice : cur.price
            return price * (coupon.discount / 100) + acc;
         } , 0)
         // console.log(cartAllowedItems)
      } else {
         discount += coupon.discount * cartAllowedItems.length
      }
   })
   // console.log(discount)
   user.cart.totalPrice = Number(totalPrice) 
   user.cart.discount = Number(discount)
   user.cart.priceToPay = (Number(totalPrice) - Number(discount)) > 0 ? (Number(totalPrice) - Number(discount)) : 0
   await user.save()

   return user.cart
}

export default getUpdatedCart