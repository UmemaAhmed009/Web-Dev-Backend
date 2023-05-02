const express = require('express')
const bcrypt = require('bcrypt')
//const jwt = require("jsonwebtoken");
const createError = require("http-errors")
const {AccessToken, RefreshToken, verifyRefreshToken, verifyAccessToken} = require("../helpers/jwt_helpers")
const router = express.Router()
const mongoose= require('mongoose');
const {authSchema}=require('../helpers/validation_schema')
// const Authorization = require ("../helpers/authorization")

// importing user schema
const User = require("../models/user");

// //SIGN UP API
// router.post('/signup', async(req, res, next)=>{
//     try{
//         const result=await authSchema.validateAsync(req.body)
        
//         const doesExist=await User.findOne({email:result.email})
//         if (doesExist)
//             throw createError.Conflict(`${result.email} is already been registered`)
        
//         const user= new User({
//             _id: new mongoose.Types.ObjectId(),
//             name:result.name,
//             email:result.email,
//             password:result.password,
//             role_id:"1"
            
//         })
//         const savedUser=await user.save()
//         const accessToken = await AccessToken(savedUser.id)
//         const refreshToken = await RefreshToken(savedUser.id)
//         res.send({savedUser, accessToken, refreshToken})
//     } catch (error){
//         if (error.isJoi === true) error.status = 422
//         next(error)
//     }
// })

//LOGIN API
router.post('/login', async (req, res, next) => {
    try {
        const result = await authSchema.validateAsync(req.body)
        const user = await User.findOne({ email: result.email })

        if (!user) throw createError.NotFound('User not registered')
        if (user.role_id!="1") throw createError.Forbidden('Invalid login')

        const isMatch = await user.isValidPassword(result.password)
        if (!isMatch) throw createError.Unauthorized('Username/password is invalid')

        const accessToken = await AccessToken(user.id)
        const refreshToken = await RefreshToken(user.id)
        res.send({ accessToken, refreshToken })

    } catch (error) {
        if (error.isJoi === true)
            return next(createError.BadRequest("Invalid Username/Password"))
        next(error)
    }
})

//GENERATE NEW ACCESS TOKEN BASED ON GIVEN REFRESH TOKEN 
router.post('/refresh-token', async (req, res, next) => {
    try {
        const { refreshToken } = req.body
        if (!refreshToken) throw createError.BadRequest()
        const userId = await verifyRefreshToken(refreshToken)

        const accessToken = await AccessToken(userId)
        // const refToken = await RefreshToken(userId)
        // res.send({ accessToken: accessToken, refreshToken: refToken })
        res.send({ accessToken: accessToken})

    } catch (error) {
        next(error)

    }
})

module.exports = router
