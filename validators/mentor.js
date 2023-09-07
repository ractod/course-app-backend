import Joi from "joi";

const updateProfileValidator = Joi.object({
   fullname: Joi.string().required(),
   email: Joi.string().required().email(),
   biography: Joi.string().required(),
   experience: Joi.string().required(),
   fields: Joi.array().required().min(1),
   phoneNumber: Joi.string()
      .required()
      .pattern(
         /(0|\+98)?([ ]|-|[()]){0,2}9[1|2|3|4]([ ]|-|[()]){0,2}(?:[0-9]([ ]|-|[()]){0,2}){8}/
      ),
});


const sessionSchema = Joi.object({
   title: Joi.string().required(),
   description: Joi.string().allow(""),
   isFree: Joi.boolean().default(false),
   videoLink: Joi.string()
});

const courseValidator = Joi.object({
   title: Joi.string().required(),
   description: Joi.string().required(),
   cover: Joi.string(),
   duration: Joi.string().required(),
   sessions: Joi.array().min(1).items(sessionSchema),
   price: Joi.string().required(),
   discount: Joi.string(),
   category: Joi.string().required(),
});

const rateValidator = Joi.object({
   rate: Joi.number().required().min(1),
});

const couponValidator = Joi.object({
   code: Joi.string().required(),
   discount: Joi.number().required(),
   expireDate: Joi.date().required(),
   inStockCount: Joi.number().min(1),
   courses: Joi.array().min(1).items(Joi.string()),
   type: Joi.string().valid("percentage", "fixed_amount").required(),
});

const socialMediasValidator  = Joi.object({
   instagram: Joi.optional(),
   facebook: Joi.optional(),
   linkedin: Joi.optional(),
   twitter: Joi.optional(),
})

export {
   courseValidator,
   updateProfileValidator,
   rateValidator,
   couponValidator,
   socialMediasValidator
};
