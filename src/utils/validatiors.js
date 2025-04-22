import Joi from 'joi'

// Users
export const FIELD_REQUIRED_MESSAGE = 'Vui lòng không để trống!'
export const EMAIL_RULE = /^\S+@\S+\.\S+$/
export const EMAIL_RULE_MESSAGE =
  'Email không đúng định dạng! (example@gmail.com)'
export const PASSWORD_RULE = /^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d\W]{8,256}$/
export const PASSWORD_RULE_MESSAGE =
  'Mật khẩu phải gồm ít nhất 1 chữ, 1 số và có ít nhất 8 ký tự!'
export const PASSWORD_CONFIRMATION_MESSAGE = 'Mật khẩu không trùng khớp!'

// Categories
export const categorySchema = Joi.object({
  name: Joi.string().required().min(3).max(50).trim().messages({
    // 'any.required': 'Tên danh mục là bắt buộc',
    'string.empty': 'Vui lòng nhập tên danh mục!',
    'string.max': 'Tên danh mục phải ít hơn hoặc bằng 50 ký tự!',
    'string.min': 'Tên danh mục phải nhiều hơn 3 ký tự!'
  })
})
