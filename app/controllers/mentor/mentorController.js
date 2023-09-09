import getUser from "../../../utils/getUser.js";
import CouponModel from "../../models/coupon.js";
import CourseModel from "../../models/course.js";
import FieldModel from "../../models/field.js";
import UserModel from "../../models/user.js";
import uploader from "../../../utils/uploader.js";
import { getVideoDurationInSeconds } from "get-video-duration";

class MentorController {
   async updateProfile(req, res) {
      try {
         const {
            biography,
            experience,
            fields,
            phoneNumber,
            fullname, 
            email
         } = req.body;
         const mentor = await UserModel.findById(req.userId);

         mentor.set({
            fullname,
            email,
            mentorData: {
               biography,
               experience,
               fields,
               phoneNumber,
            }
         })
         
         await mentor.save();
         const newMentor = await getUser(req)

         res.status(200).json({
            mentor: newMentor,
            message: "اطلاعات شما با موفقیت تغییر کرد",
         });
      } catch (error) {
         console.log(error)
         res.status(500).json({ message: "خطلا در برقراری ارتباط با سرور" });
      }
   }

   async updateSocialMedias(req, res) {
      try {
         const { instagram, linkedin, facebook, twitter } = req.body;
         const mentor = await UserModel.findByIdAndUpdate(req.userId, {
            $set: { "mentorData.socialMedias": {
               instagram, linkedin, facebook, twitter
            } }
         }, { new: true })
         
         res.status(201).json({
            mentor,
            message: "اطلاعات شما با موفقیت تغییر کرد",
         });
      } catch (error) {
         console.log(error);
         res.status(500).json({ message: "خطلا در برقراری ارتباط با سرور" });
      }
   }

   async createCourse(req, res) {
      try {
         const [coverFile, ...sessionsFiles] = req.files
         const [uploadedCoverFile] = await uploader([coverFile], "image")
         const uploadedSessionsFiles = await uploader(sessionsFiles, "video")

         const {
            title,
            price, 
            discount,
            category,
            duration,
            sessions,
            description
         } = req.body
         
         const durationsPromise = uploadedSessionsFiles.map(async (file) => {
            return getVideoDurationInSeconds(file.url).then(duration => Number(duration / 60).toFixed(2))
         })
         const durations = await Promise.all(durationsPromise)

         const updatedSession = sessions.map((session, index) => ({
            title: session.title,
            description: session.description || "",
            videoLink: uploadedSessionsFiles[index].url,
            duration: durations[index],
            isFree: session.isFree
         }))

         const course = await CourseModel.create({
            title,
            sessions: updatedSession,
            price,
            discount,
            category,
            cover: uploadedCoverFile.url,
            mentor: req.userId,
            details: { description, duration },
            offPrice: Number(discount) ? price - discount : null,
         });
         await course.populate("mentor category")
         await UserModel.findByIdAndUpdate(req.userId, {
            $push: { 
               "mentorData.courses": course._id,
               "purchasedCourses": course._id 
            },
         });

         res.status(201).json({
            course,
            message: "دوره شما با موفقیت ساخته شد و در انتظار برسی می باشد",
         });
      } catch (error) {
         console.log(error, "error");
         res.status(500).json({ message: "خطلا در برقراری ارتباط با سرور" });
      }
   }

   async updateCourse(req, res) {
      try {
         const coverFile = req.files.find(file => file.mimetype.startsWith("image")) || []
         const sessionsFiles = req.files.filter(file => file.mimetype.startsWith("video"))
         const [uploadedCoverFile] = await uploader(coverFile, "image")
         const uploadedSessionsFiles = await uploader(sessionsFiles, "video")

         const {
            title,
            sessions,
            cover,
            price,
            discount,
            description,
            duration,
            category
         } = req.body;

         const durationsPromise = uploadedSessionsFiles.map(file => {
            return getVideoDurationInSeconds(
               file.url
            ).then(duration => Number(duration / 60).toFixed(2))
         })
         const durations = await Promise.all(durationsPromise)
         const updatedSession = sessions.map((session) => ({
            title: session.title,
            description: session.description || "",
            videoLink: session.videoLink || uploadedSessionsFiles.splice(0, 1)[0].url,
            duration: session.duration || durations.splice(0, 1)[0],
            isFree: session.isFree
         }))

         const course = await CourseModel.findByIdAndUpdate(
            req.params.courseId,
            {
               title,
               sessions: updatedSession,
               cover: cover || uploadedCoverFile.url,
               price,
               discount,
               category,
               status: "in_progress",
               details: { description, duration },
               offPrice: Number(discount) ? price - discount : null,
            },
            {new: true}
         );
         await course.populate("mentor category")

         res.status(200).json({
            course,
            message: "دوره شما تغییر کرد و در انتظار برسی می باشد",
         });
      } catch(error) {
         console.log(error)
         res.status(500).json({ message: "خطلا در برقراری ارتباط با سرور" });
      }
   }

   async deleteCourse(req, res) {
      try {
         await CourseModel.findByIdAndUpdate(req.params.courseId, { status: "deleted" })
         await UserModel.findByIdAndUpdate(req.userId, {
            $pull: { 
               "mentorData.courses": req.params.courseId, 
               "purchasedCourses": req.params.courseId 
            },
         })
   
         res.status(200).json({ message: "دوره شما با موفقیت حذف شد", });
      } catch {
         res.status(500).json({ message: "خطلا در برقراری ارتباط با سرور" });
      }
   }

   async rate(req, res) {
      try {
         const mentor = await UserModel.findById(req.params.mentorId);
         const rate = mentor.mentorData.rate;

         rate.users = rate.users.filter((user) => {
            return user.userId != req.userId;
         });
         rate.users.push({
            userId: req.userId,
            rate: req.body.rate,
         });
         rate.totalAmount = rate.users.length;
         rate.totalRate = rate.users.reduce((acc, curr) => {
            return acc + curr.rate;
         }, 0);
         rate.avrage = rate.totalRate / rate.totalAmount;
         await mentor.save();

         res.status(200).json({ message: "رای شما ثبت شد", avrage: mentor.mentorData.rate.avrage });
      } catch {
         res.status(500).json({ message: "خطلا در برقراری ارتباط با سرور" });
      }
   }

   async createCoupon(req, res) {
      try {
         const { code, discount, expireDate, inStockCount, courses, type } = req.body;

         const existingCode = await CouponModel.exists({ code })
         if(existingCode) {
            return res.status(400).json({ message: "این کد تخفیف از قبل وجود دارد" })
         }

         const coupon = await CouponModel.create({
            code,
            discount,
            expireDate,
            inStockCount,
            courses,
            type
         });
         coupon.populate("courses")
         const user = await UserModel.findByIdAndUpdate(req.userId, {
            $push: { "mentorData.coupons": coupon._id },
         }, { new: true });

         res.status(201).json({
            coupon,
            message: "کد تخفیف شما ساخته شد",
         });
      } catch {
         res.status(500).json({ message: "خطلا در برقراری ارتباط با سرور" });
      }
   }

   async updateCoupon(req, res) {
      try {
         const { code, discount, expireDate, inStockCount, courses, type } = req.body;
         console.log(req.params.couponId)
         const coupon = await CouponModel.findById(req.params.couponId)
         const existingCode = await CouponModel.exists({ code })
         if(existingCode && coupon.code != code) {
            return res.status(400).json({ message: "این کد تخفیف از قبل وجود دارد" })
         }

         coupon.set({  
            code,
            discount,
            expireDate,
            inStockCount,
            courses,
            type
         })
         await coupon.save()
         await coupon.populate({
            path: "courses",
            model: "Course",
            select: "title"
         })
         console.log(coupon)
   
         res.status(200).json({ coupon, message: "کد تخفیف شما با موفقیت تغییر کرد" })
      } catch(error) {
         console.log(error)
         res.status(500).json({ message: "خطلا در برقراری ارتباط با سرور" });
      }
   }

   async deleteCoupon(req, res) {
      try {
         await CouponModel.findByIdAndDelete(req.params.couponId)
         await UserModel.findByIdAndUpdate(req.userId, {
            $pull: { "mentorData.coupons": req.params.couponId }
         })
   
         res.status(200).json({ message: "کد تخفیف شما با موفقیت حذف شد" })
      } catch {
         res.status(500).json({ message: "خطلا در برقراری ارتباط با سرور" });
      }
   }

   async getAllMentors(req, res) {
      try {
         const queries = { role: "mentor", status: { $ne: "deleted" } }
         if(req.query.field) {
            const field = await FieldModel.findOne({ englishTitle: req.query.field })
            console.log(field)
            queries["mentorData.fields"] =  { $in: field._id }
         }
         
         const mentors = await UserModel.find(queries).populate("mentorData.fields")

         res.status(200).json(mentors)
      } catch {
         res.status(500).json({ message: "خطلا در برقراری ارتباط با سرور" });
      }
   }

   async getOneMentor(req, res) {
      try {
         const mentor = await UserModel.findOne({_id: req.params.mentorId, status: { $ne: "deleted" }}).populate({
            path: "mentorData.courses",
            model: "Course",
            populate: "mentor category"
         }).populate("mentorData.fields")
         res.status(200).json(mentor)
      } catch {
         res.status(500).json({ message: "خطلا در برقراری ارتباط با سرور" });
      }
   }
}

export default new MentorController();
