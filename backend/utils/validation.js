const Joi = require('joi');

const registerSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const productSchema = Joi.object({
  name: Joi.string().min(2).max(200).required(),
  description: Joi.string().required(),
  price: Joi.number().min(0).required(),
  category: Joi.string()
    .valid('t-shirts', 'shirts', 'pants', 'dresses', 'jackets', 'accessories')
    .required(),
  images: Joi.array().items(Joi.string()),
  sizes: Joi.array().items(
    Joi.object({
      size: Joi.string().valid('XS', 'S', 'M', 'L', 'XL', 'XXL'),
      stock: Joi.number().min(0),
    })
  ),
  colors: Joi.array().items(Joi.string()),
  brand: Joi.string(),
  isFeatured: Joi.boolean(),
  discount: Joi.number().min(0).max(100),
});

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details.map((d) => d.message).join(', '),
    });
  }
  next();
};

module.exports = { validate, registerSchema, loginSchema, productSchema };
