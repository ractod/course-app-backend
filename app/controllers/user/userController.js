// models
import UserModel from "../../models/user.js"
// utils
import { setToken, verifyToken } from "../../../utils/auth.js"
// library
import BCRYPTJS  from "bcryptjs"
import JWT from "jsonwebtoken"
import { serialize } from "cookie"
import getUpdatedCart from "../../../utils/getUpdatedCart.js"
import getUser from "../../../utils/getUser.js"
import uploader from "../../../utils/uploader.js"

function parseCookies(request) {
   const list = {};
   const cookieHeader = request.headers?.cookie;
   if (!cookieHeader) return list;

   cookieHeader.split(`;`).forEach(function (cookie) {
      let [name, ...rest] = cookie.split(`=`);
      name = name?.trim();
      if (!name) return;
      const value = rest.join(`=`).trim();
      if (!value) return;
      list[name] = decodeURIComponent(value);
   });

   return list;
}

class UserController {
   async signup(req, res) {
      try {
         const { email, password, fullname } = req.body
   
         const existingEmail = await UserModel.exists({ email })
         if(existingEmail) {
            return res.status(400).json({ message: "کاربری با این ایمیل وجود دارد" })
         }
   
         const hashedPassword = await BCRYPTJS.hash(password, 12)
         const user = await UserModel.create({ fullname, email, password: hashedPassword })
         setToken(user._id, res)
   
         res.status(201).json({ message: "حساب شما با موفقیت ساخته شد" })
      } catch {
         res.status(500).json({ message: "خطلا در برقراری ارتباط با سرور" })
      }
   }

   async signin(req, res) {
      try {
         const { email, password } = req.body
         const user = await UserModel.findOne({ email })
         if(!user) {
            return res.status(400).json({ message: "ایمیل یا رمز عبور اشتباه می باشد" })
         }
         
         const isPasswordVerified = await BCRYPTJS.compare(password, user.password)
         if(!isPasswordVerified) {
            return res.status(400).json({ message: "ایمیل یا رمز عبور اشتباه می باشد" })
         }

         if(user.status === "deleted") {
            return res.status(400).json({ message: "حساب کاربری شما به دستور ادمین از دسترس خارج شده" })
         }
   
         setToken(user._id, res)
   
         res.status(200).json({ message: "شما با موفقیت وارد حساب کاربری خود شدید" })
      } catch {
         res.status(500).json({ message: "خطلا در برقراری ارتباط با سرور" })
      }
   }

   async signout(req, res) {
      try {
         const token = JWT.sign({}, process.env.COOKIE_SECRET, { expiresIn: 0 }) 
         const options = serialize("token", token, {
            maxAge: 0, 
            httpOnly: true,
            path: "/",
            sameSite: 'none',
            secure: true,
         })
         res.status(200)
         .setHeader("Set-Cookie", options)
         .json({ message: "شما با موفقیت از حساب خود خارج شدید" })
      } catch {
         res.status(500).json({ message: "خطلا در برقراری ارتباط با سرور" })
      }
   }

   async getSession(req, res) {
      try {
         const token = parseCookies(req).token
         const isTokenVerified = verifyToken(token)
      
         if(isTokenVerified) {
            return res.status(200).json({ status: "authenticated" })
         } else {
            return res.status(200).json({ status: "unAuthenticated" })
         }
      } catch {
         res.status(500).json({ message: "خطلا در برقراری ارتباط با سرور" })
      }
   }

   async upgradeToMentor(req, res) {
      try {
         const { phoneNumber, biography, experience, fields} = req.body
         await UserModel.findByIdAndUpdate(req.userId, {
            mentorData: { phoneNumber ,biography, experience, fields },
            role: "mentor"
         })
   
         res.status(200).json({ message: "شما با موفقیت به سطح مدرس ارتقا یافتید" })
   
      } catch(error) {
         res.status(500).json({ message: "خطلا در برقراری ارتباط با سرور" })
      }
   }

   async updateUserPorfile(req, res) {
      try {
         const { email, fullname } = req.body
         const user = await UserModel.findById(req.userId)
         
         const existingEmail = await UserModel.exists({ email })
         if(existingEmail && user.email != email) {
            res.status(400).json({ message: "کاربری با این ایمیل وجود دارد" })
         }

         user.email = email
         user.fullname = fullname
         await user.save()
   
         res.status(200).json({ user, message: "اطلاعات شما با موفقیت تغییر کرد" })
      } catch(error) {
         res.status(500).json({ message: "خطلا در برقراری ارتباط با سرور" })
      }
   }

   async getUserRole(req, res) {
      try {
         const user = await UserModel.findById(req.userId)
         res.status(200).json({ role: user.role })
      } catch {
         res.status(500).json({ message: "خطلا در برقراری ارتباط با سرور" })
      }
   }

   async getUser(req, res) {
      try {
         console.log("alo")
         const user = await getUser(req)
         if(req.userId) {
            const cart = await getUpdatedCart(req)
            user.cart = cart
         }
         res.status(200).json(user || null)
      } catch(error) {
         console.log(error)
         res.status(500).json({ message: "خطلا در برقراری ارتباط با سرور" })
      }
   }

   async updateAvatar(req, res) {
      try {
         const [avatar] = await uploader([req.file], "image")
         await UserModel.findByIdAndUpdate(req.userId, { avatar: avatar.url })
         console.log(avatar)
         res.status(200).json({ message: "عکس پروفایل شما با موفقیت تغییر کرد", avatar: avatar.url })
      } catch(error) {
         console.log(error)
         res.status(500).json({ message: "خطلا در برقراری ارتباط با سرور" })
      }
   }
}

export default new UserController()
