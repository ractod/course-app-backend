import Joi from "joi"

const rejectCourseValidator = Joi.object({
   statusMessage: Joi.string().required()
})

const categoryValidator = Joi.object({
   title: Joi.string().required(),
   englishTitle: Joi.string().required()
})

const fieldValidator = Joi.object({
   title: Joi.string().required(),
   englishTitle: Joi.string().required()
})

export {
   rejectCourseValidator,
   categoryValidator,
   fieldValidator
}