import Joi from "joi";
import roles from "../constants/roles.constants.js";

const signupSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).required().label("Name").messages({
    "string.empty": "Name is required",
    "string.min": "Name must be at least 2 characters",
    "string.max": "Name must be less than 50 characters",
  }),
  email: Joi.string()
    .trim()
    .email()
    .lowercase()
    .required()
    .label("Email")
    .messages({
      "string.empty": "Email is required",
      "string.email": "Email must be valid",
    }),
  password: Joi.string()
    .min(6)
    .max(128)
    .pattern(new RegExp("^(?=.*\\d).+$")) // At least one number, optional
    .required()
    .label("Password")
    .messages({
      "string.empty": "Password is required",
      "string.min": "Password must be at least 6 characters",
      "string.max": "Password must be less than 128 characters",
      "string.pattern.base": "Password must contain at least one number",
    }),
  confirmPassword: Joi.string()
    .valid(Joi.ref("password"))
    .required()
    .label("Confirm password")
    .messages({
      "any.only": "Passwords do not match",
      "string.empty": "Confirm password is required",
    }),
  role: Joi.string()
    .trim()
    .valid(...roles)
    .label("Role")
    .default("user")
    .messages({
      "string.empty": "Role is required",
      "any.only": `Role must be one of: ${roles.join(", ")}`,
    }),
}).options({ abortEarly: false });

const loginSchema = Joi.object({
  email: Joi.string()
    .trim()
    .email()
    .lowercase()
    .required()
    .label("Email")
    .messages({
      "string.empty": "Email is required",
      "string.email": "Email must be valid",
    }),
  password: Joi.string().min(6).max(128).required().label("Password").messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 6 characters",
    "string.max": "Password must be less than 128 characters",
  }),
}).options({ abortEarly: false });

const changePasswordSchema = Joi.object({
  oldPassword: Joi.string()
    .min(6)
    .max(128)
    .required()
    .label("Old Password")
    .messages({
      "string.empty": "Old Password is required",
      "string.min": "Password must be at least 6 characters",
      "string.max": "Password must be less than 128 characters",
    }),
  newPassword: Joi.string()
    .min(6)
    .max(128)
    .required()
    .label("New Password")
    .messages({
      "string.empty": "New Password is required",
      "string.min": "Password must be at least 6 characters",
      "string.max": "Password must be less than 128 characters",
    }),
}).options({ abortEarly: false });

const forgotPasswordSchema = Joi.object({
  email: Joi.string()
    .trim()
    .email()
    .lowercase()
    .required()
    .label("Email")
    .messages({
      "string.empty": "Email is required",
      "string.email": "Email must be valid",
    }),
}).options({ abortEarly: false });

const resetPasswordSchema = Joi.object({
  newPassword: Joi.string()
    .min(6)
    .max(128)
    .required()
    .label("New Password")
    .messages({
      "string.empty": "New Password is required",
      "string.min": "Password must be at least 6 characters",
      "string.max": "Password must be less than 128 characters",
    }),
  confirmPassword: Joi.string()
    .valid(Joi.ref("newPassword"))
    .required()
    .label("Confirm Password")
    .messages({
      "any.only": "Passwords do not match",
      "string.empty": "Confirm Password is required",
    }),
}).options({ abortEarly: false });

export {
  signupSchema,
  loginSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
};
