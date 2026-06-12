const Joi = require("joi");

const schema = Joi.object({
  PORT: Joi.number().default(5000),
  MONGO_URI: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  CLOUDINARY_CLOUD_NAME: Joi.string().required(),
  CLOUDINARY_API_KEY: Joi.string().required(),
  CLOUDINARY_API_SECRET: Joi.string().required(),
}).unknown();

const { error, value } = schema.validate(process.env);

if (error) {
  throw new Error(`Environment validation error: ${error.message}`);
}

module.exports = value;

//npm install joi