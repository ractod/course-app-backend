import Joi from "joi";

const signupValidator = Joi.object({
   fullname: Joi.string().min(3).required(),
   email: Joi.string().email().required(),
   password: Joi.string()
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)
      .required(),
});

const signinValidator = Joi.object({
   email: Joi.string().email().required(),
   password: Joi.string().required(),
});

const upgradeToMentorValidator = Joi.object({
   biography: Joi.string().required(),
   experience: Joi.string().required(),
   fields: Joi.array().min(1),
   phoneNumber: Joi.number().required()
});

const updateUserProfileValidator = Joi.object({
   email: Joi.string().email().required(),
   fullname: Joi.string().min(3).required(),
});

export {
   signupValidator,
   signinValidator,
   upgradeToMentorValidator,
   updateUserProfileValidator,
};
