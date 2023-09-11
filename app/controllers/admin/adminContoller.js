import CategoryModel from "../../models/cateogry.js"
import CourseModel from "../../models/course.js"
import FieldModel from "../../models/field.js"
import PaymentModel from "../../models/payment.js"
import UserModel from "../../models/user.js"

class AdminContoller {
   async getAllPayments(req, res) {
      try {
         const payments = await PaymentModel.find({})
            .populate({
               path: "user",
               select: "email",
               model: "User"
            })
            .populate({
               path: "courses",
               select: "title",
               model: "Course"
            })
         res.status(200).json(payments)
      } catch {
         res.status(500).json({ message: "خطا در برقراری ارتباط با سرور" })
      }
   }

   async getCourses(req, res) {
      try {
         const courses = await CourseModel.find({ status: { $ne: "deleted" } }).populate("mentor category")
         res.status(200).json(courses)
      } catch {
         res.status(500).json({ message: "خطا در برقراری ارتباط با سرور" })
      }
   }

   async rejectCourse(req, res) {
      try {
         const course = await CourseModel.findByIdAndUpdate(req.params.courseId, {
            statusMessage: req.body.statusMessage,
            status: "rejected"
         }, { new: true })
         await course.populate("mentor category")
         res.status(200).json({ message: "دوره مورد نظر رد شد", course })
      } catch {
         res.status(500).json({ message: "خطا در برقراری ارتباط با سرور" })
      }
   }

   async verifyCourse(req, res) {
      try {
         const course = await CourseModel.findByIdAndUpdate(req.params.courseId, { status: "verified" }, { new: true })
         await course.populate("mentor category")
         res.status(200).json({ message: "دوره مورد نظر تایید شد", course })
      } catch {
         res.status(500).json({ message: "خطا در برقراری ارتباط با سرور" })
      }
   }

   async getAllCategories(req, res) {
      try {
         const categories = await CategoryModel.find({ status: { $ne: "deleted" } })
         res.status(200).json(categories)
      } catch {
         res.status(500).json({ message: "خطا در برقراری ارتباط با سرور" })
      }
   } 

   async createCategory(req, res) {
      try {
         const { title, englishTitle } = req.body
         const category = await CategoryModel.create({ title, englishTitle })
         res.status(201).json({ message: "دسته بندی با موفقیت ساخته شد", category })
      } catch {
         res.status(500).json({ message: "خطا در برقراری ارتباط با سرور" })
      }
   }

   async updateCategory(req, res) {
      try {
         const { title, englishTitle } = req.body
         const category = await CategoryModel.findByIdAndUpdate(req.params.categoryId, {
            title, englishTitle
         }, { new: true })
         res.status(200).json({ message: "دسته بندی مورد نظر با موفقیت تغییر کرد", category })
      } catch {
         res.status(500).json({ message: "خطا در برقراری ارتباط با سرور" })
      }
   }

   async deleteCategory(req, res) {
      try {
         await CategoryModel.findByIdAndUpdate(req.params.categoryId, { status: "deleted" })
         res.status(200).json({ message: "دستبه بندی مورد نظر با موفقیت حذف شد" })
      } catch {
         res.status(500).json({ message: "خطا در برقراری ارتباط با سرور" })
      }
   }

   async getAllFields(req, res) {
      try {
         const fields = await FieldModel.find({ status: { $ne: "deleted" } })
         res.status(200).json(fields)
      } catch {
         res.status(500).json({ message: "خطا در برقراری ارتباط با سرور" })
      }
   } 

   async createField(req, res) {
      try {
         const { title, englishTitle } = req.body
         const field = await FieldModel.create({ title, englishTitle })
         res.status(201).json({ message: "حوضه با موفقیت ساخته شد", field })
      } catch {
         res.status(500).json({ message: "خطا در برقراری ارتباط با سرور" })
      }
   }

   async updateField(req, res) {
      try {
         const { title, englishTitle } = req.body
         const field = await FieldModel.findByIdAndUpdate(req.params.fieldId, {
            title, englishTitle
         }, { new: true })
         res.status(200).json({ message: "رشته مورد نظر با موفقیت تغییر کرد", field })
      } catch {
         res.status(500).json({ message: "خطا در برقراری ارتباط با سرور" })
      }
   }

   async deleteField(req, res) {
      try {
         await FieldModel.findByIdAndUpdate(req.params.fieldId, { status: "deleted" })
         res.status(200).json({ message: "رشته مورد نظر با موفقیت حذف شد" })
      } catch {
         res.status(500).json({ message: "خطا در برقراری ارتباط با سرور" })
      }
   }

   async getAllUsers(req, res) {
      try {
         const users = await UserModel.find({ _id: { $ne: req.userId }, status: { $ne: "deleted" } }).populate({
            path: "purchasedCourses",
            select: "title",
            model: "Course"
         })
         res.status(200).json(users)
      } catch(error) {
         console.log(error)
         res.status(500).json({ message: "خطا در برقراری ارتباط با سرور" })
      }
   }

   async deleteUser(req, res) {
      try {
         await UserModel.findByIdAndUpdate(req.params.userId, { status: "deleted" })
         res.status(200).json({ message: "کاربر با موفقیت حذف شد" })
      } catch(error) {
         console.log(error)
         res.status(500).json({ message: "خطا در برقراری ارتباط با سرور" })
      }
   }

   async getOverview(req, res) {
      try {
         const users = await UserModel.find({ status: { $ne: "deleted" } })
         const mentors = users.filter(user => user.role === "mentor")
         const courses = await CourseModel.find({ status: { $ne: "deleted" } })
         const inProgress = courses.filter(course => course.status == "in_progress")
         const categories = await CategoryModel.find({ status: { $ne: "deleted" } })
         const fields = await FieldModel.find({ status: { $ne: "deleted" } })
         const payments = await PaymentModel.find({})
            .populate({
               path: "user",
               select: "email",
               model: "User"
            })
            .populate({
               path: "courses",
               select: "title",
               model: "Course"
            })

         res.status(200).json({
            usersCount: users.length,
            coursesCount: courses.length,
            categoriesCount: categories.length,
            fieldsCount: fields.length,
            paymentsCount: payments.length,
            payments: payments.reverse().slice(0, 3),
            mentorsCount: mentors.length,
            inProgressCount: inProgress.length
         })
      } catch(error) {
         console.log(error)
         res.status(500).json({ message: "خطا در برقراری ارتباط با سرور" })
      }
   }
}

export default new AdminContoller