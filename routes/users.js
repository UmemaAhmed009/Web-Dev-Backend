const express = require('express')
const bcrypt = require('bcrypt')
//const jwt = require("jsonwebtoken");
const createError = require("http-errors")
const {AccessToken, RefreshToken, verifyRefreshToken, verifyAccessToken} = require("../helpers/jwt_helpers")
const router = express.Router()
const mongoose= require('mongoose');
const {authSchema}=require('../helpers/validation_schema')
const Authorization = require ("../helpers/authorization")

// importing user schema
const User = require("../models/user");

//SIGN UP API
router.post('/signup', async(req, res, next)=>{
    try{
        const result=await authSchema.validateAsync(req.body)
        
        const doesExist=await User.findOne({email:result.email})
        if (doesExist)
            throw createError.Conflict(`${result.email} is already been registered`)
        
        const user= new User({
            _id: new mongoose.Types.ObjectId(),
            name:result.name,
            email:result.email,
            password:result.password,
            role_id: 2,
            age:result.age
            
        })
        const savedUser=await user.save()
        const accessToken = await AccessToken(savedUser.id)
        const refreshToken = await RefreshToken(savedUser.id)
        res.send({savedUser, accessToken, refreshToken})
    } catch (error){
        if (error.isJoi === true) error.status = 422
        next(error)
    }
})

//LOGIN API
router.post('/login', async (req, res, next) => {
    try {
        const result = await authSchema.validateAsync(req.body)
        const user = await User.findOne({ email: result.email })
        console.log("RESULT", result)
        if (!user) throw createError.NotFound('User not registered')

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

//FOR ADMIN LOGIN
router.post('/loginAdmin', async (req, res, next) => {
    try {
        const result = await authSchema.validateAsync(req.body)
        const user = await User.findOne({ email: result.email })

        if (!user) throw createError.NotFound('User not registered')

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
        const refToken = await RefreshToken(userId)
        res.send({ accessToken: accessToken, refreshToken: refToken })
        // res.send({ accessToken: accessToken})

    } catch (error) {
        next(error)

    }
})

//checks for authentication based on the token passed in the header
//then checks for authorization, if role_id=1 i.e. admin, API hit is allowed
//GET ALL USERS
//router.get('/', verifyAccessToken, Authorization(1), (req, res, next) => {
router.get('/', (req, res, next) => {
    User.find()
    .exec()
    .then(docs =>{
        console.log(docs);
        const count = docs.length;
        res.status(200).json({docs, count});
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error:err
        });
    });
});

//GET BY ID API
router.get('/:id'/*, verifyAccessToken*/, async(req,res) =>{
    try{
        const users =  await User.findById(req.params.id)
        res.json(users)
    }
    catch(err){
        res.send("Error found getting user by ID " + err)
    }
})

//PUT API
router.put('/:id', async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
  
      Object.assign(user, req.body);
  
      if (req.body.password) {
        user.password = await bcrypt.hash(req.body.password, 10);
      }
  
      const updatedUser = await user.save();
      res.json(updatedUser);
    } catch (err) {
      res.send('Error on put');
    }
  });
  

//POST API
router.post('/', async(req,res) => {
    const user = new User({
        name:req.body.name,
        email: req.body.email,
        password: req.body.password,
        role_id: req.body.role_id,
        age: req.body.age
    })
    try{
        const u1 = await user.save()
        res.json(u1)
    }catch(err){
        res.send('Error on post' + err)
    }

})

//DELETE API
router.delete("/:id", (req, res, next) =>{
    User.remove({_id:req.params.id})
    .exec()
    .then(result =>{
        res.status(200).json({
            message:"User deleted"
        });
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});
module.exports = router