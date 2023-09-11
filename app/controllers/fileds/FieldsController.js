import FieldModel from "../../models/field.js"

class FieldsController {
  async getAllFileds(req, res) {
    try {
      const fields = await FieldModel.find({ status: { $ne: "deleted" } })
      res.status(200).json(fields)
    } catch {
      res.status(500).json({ message: "خطا در برقراری ارتباط با سرور" })
    }
  }
}

export default new FieldsController()