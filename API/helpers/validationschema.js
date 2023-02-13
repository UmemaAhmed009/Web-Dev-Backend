const Joi = require('@hapi/joi') //what is this

const authSchema =Joi.object({
    name:Joi.string(),
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(8).required()
})

module.exports ={
    authSchema
}