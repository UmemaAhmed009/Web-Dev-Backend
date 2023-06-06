const joi =require('@hapi/joi')

const authSchema=joi.object({
    name: joi.string(),
    email: joi.string().email().required(),
    password: joi.string().min(8).required(),
    role_id:joi.number(),
    age:joi.number()
})

module.exports={ authSchema}