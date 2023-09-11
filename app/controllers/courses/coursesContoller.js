import CategoryModel from "../../models/cateogry.js";
import CourseModel from "../../models/course.js";
import UserModel from "../../models/user.js";

function sortCourses(sort, courses) {
   console.log(Date.now())
   switch(sort) {
      case "expensivest": {
         return courses.sort((a, b) => {
            return (b.price - b.discount) - (a.price - a.discount)
         })
      }
      case "cheapest": {
         return courses.sort((a, b) => {
            return (a.price - a.discount) - (b.price - b.discount)
         })
      }
      case "popular": {
         return courses.sort((a, b) => {
            return b.likes - a.likes
         })
      }
      case "newest": {
         return courses.sort((a,b) => {
            return b.date - a.date
         })
      }
      case "newest": {
         return courses.sort((a,b) => {
            return a.date - b.date
         })
      }
      default: {
         return courses
      }
   }
}

class CourseController {
   async getAllCourses(req, res) {
      try {
         let { category, search, sort, page, limit } = req.query;
         const queries = { status: "verified" };

         if (category) {
            const categoryId = await CategoryModel.find({
               englishTitle: category,
            });
            queries.category = categoryId;
         }
         if (search) {
            queries.$text = { $search: search };
         }

         let courses = await CourseModel.find(queries).populate("category mentor");
         let pagesCount = 1
      
         if(sort) {
            courses = sortCourses(sort, courses)
         }
         if(limit) {
            if(!page) page = 1 
            if(courses.length >= limit) pagesCount = courses.length / limit
            courses = courses.slice((page == 1 ? 0 : (limit * (page - 1))), (page * limit))
         }

         res.status(200).json(limit ? {courses, pagesCount} : courses);
      } catch(error) {
         console.log(error)
         res.status(500).json({ message: "خطا در برقراری ارتباط با سرور" });
      }
   }

   async getOneCourse(req, res) {
      try {
         const course = await CourseModel.findOne({ _id: req.params.courseId, status: "verified"}).populate("category mentor")
         const relatedCourses = await CourseModel.find({
            category: course?.category,
            _id: { $ne: course?._id },
            status: "verified"
         }).populate("category mentor");
         
         res.status(200).json({ course, relatedCourses });
      } catch(error) {
         console.log(error)
         res.status(500).json({ message: "خطا در برقراری ارتباط با سرور" });
      }
   }

   async likeCourse(req, res) {
      try {
         const courseId = req.params.courseId;
         const user = await UserModel.findById(req.userId);
         const isLiked = user.likedCourses.includes(req.params.courseId);

         if (isLiked) {
            user.likedCourses.pull(courseId);
         } else {
            user.likedCourses.push(courseId);
         }
         const course = await CourseModel.findByIdAndUpdate(courseId, {
            $inc: { likes: isLiked ? -1 : +1 },
         }, { new: true });
         await user.save();

         res.status(200).json({
            message: isLiked ? "لایک دوره لغو شد" : "دوره با موفقیت لایک شد",
            course
         });
      } catch (error) {
         console.log(error);
         res.status(500).json({ message: "خطا در برقراری ارتباط با سرور" });
      }
   }

   async saveCourse(req, res) {
      try {
         const courseId = req.params.courseId;
         const user = await UserModel.findById(req.userId);
         const isSaved = user.savedCourses.includes(req.params.courseId);

         if (isSaved) {
            user.savedCourses.pull(courseId);
         } else {
            user.savedCourses.push(courseId);
         }
         await user.save();

         res.status(200).json({
            message: isSaved
               ? "دوره از لیست ذخیره حذف شد"
               : "دوره به لیست ذخیره اضافه شد",
         });
      } catch (error) {
         console.log(error);
         res.status(500).json({ message: "خطا در برقراری ارتباط با سرور" });
      }
   }
}

export default new CourseController();
