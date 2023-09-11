import CategoryModel from "../../models/cateogry.js"

class CategoriesController {
   async getAllCategories(req, res) {
      try {
         const categories = await CategoryModel.find({ status: { $ne: "deleted" } })
         res.status(200).json(categories)
      } catch {
         res.status(500).json({ message: "خطا در برقراری ارتباط با سرور" })
      }
   }
}

export default new CategoriesController