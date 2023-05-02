const joi =require('@hapi/joi')

const authSchema=joi.object({
    name: joi.string(),
    email: joi.string().email().lowercase().required(),
    password: joi.string().min(8).required(),
    role_id:joi.number()
})

module.exports={ authSchema}