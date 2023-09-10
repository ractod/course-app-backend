import { serialize } from "cookie";
import JWT from "jsonwebtoken";

function setToken(_id, res) {
   const token = JWT.sign({ _id }, process.env.COOKIE_SECRET, { expiresIn: 24 * 60 * 60 })
   const options = {
      maxAge: 24 * 60 * 60 , 
      secure: true,
      sameSite: "strict",
      httpOnly: true,
      domain: "amoziline.vercel.app"
   }
   
   res.cookie("token", token, options)
}

function verifyToken(token) {
   try {
      const verifiedToken = JWT.verify(token, process.env.COOKIE_SECRET)
      return verifiedToken
   } catch {
      return false
   }
}

export { setToken, verifyToken }