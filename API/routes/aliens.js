//Author: Minal Sarwar 22756
//References used: https://www.youtube.com/watch?v=eYVGoXPq2RA https://youtu.be/WDrU305J1yw
// const express = require('express');
// const router = express.Router();

// const bcrypt=require('bcrypt');
// const jwt = require('jsonwebtoken');
// const env = require("dotenv").config();
// const createError = require('http-errors')
// const { signAccessToken, signRefreshToken, verifyRefreshToken, verifyAccessToken } = require('../helpers/jwthelpers')
// const { authSchema } = require('../helpers/validationschema')
// const mongoose= require('mongoose');

const express = require('express');
const router = express.Router();
const mongoose= require('mongoose');
// const bcrypt= require ('bcrypt');  
// const jwt=require('jsonwebtoken');
// const checkAuth=require('../middleware/check-auth');
const createError = require('http-errors')
const {authSchema}=require('../helpers/validationschema')
const { signAccessToken, verifyAccessToken, signRefreshToken, verifyRefreshToken } = require('../helpers/jwthelpers')

const Alien = require("../models/alien");

//USER CRUD ASSIGNMENT 1
//GET
    router.get('/', verifyAccessToken, async(req, res) => {
        // try{
            // console.log("abc");
            Alien.find({}, function (err,Users){
                if (err){
                    // console.log(err);
                    res.status(401).send(err);
                }
                else{
                    // console.log(Users);
                    res.status(200).send(Users);
                }
            });
            // res.json(aliens);
        // } catch (err) {
        //     res.send('Error ' +err)
        // }
    })

    router.get('/:id', async(req, res) => {
        try{
            const alien = await Alien.findById(req.params.id)
            res.json(alien)
        } catch (err) {
            res.send('Error ' +err)
        }
    })



//POST
router.post('/', async(req,res) => {
    const alien = new Alien({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    })
  
    try {
      const a1 = await alien.save()
      res.json(a1)
    } catch(err){
       res.send('Error')
    }
  })

   
 //PUT
router.put('/:id', (req, res, next) =>{
    const id=req.params.id;
    const updateOps={};
    for (const ops of req.body){
        updateOps[ops.propName]=ops.value; //creates an array to update any attribute
    }
    Alien.update({_id:id}, { $set: updateOps}) 
    .exec()
    .then(result =>{
        console.log(result);
        res.status(200).json(result);
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error:err
        });
    });
});

//DELETE
router.delete('/:id', (req, res, next) =>{
    const id= req.params.id;
    Alien.remove({_id:id})
    .exec()
    .then(result =>{
        res.status(200).json({
            message: 'User deleted'
        });
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});




//JWT AUTHENTICATION ASSIGNMENT 2 
router.post('/signup', async(req, res, next)=>{
    try{
        const result=await authSchema.validateAsync(req.body)
        
        const doesExist=await Alien.findOne({email:result.email})
        if (doesExist)
            throw createError.Conflict(`${result.email} is already been registered`)
        
        const user= new Alien({
            _id: new mongoose.Types.ObjectId(),
            name:result.name,
            email:result.email,
            password:result.password
        })

        const savedUser=await user.save()
        const accessToken = await signAccessToken(savedUser.id)
        const refreshToken = await signRefreshToken(savedUser.id)
        res.send({savedUser, accessToken, refreshToken})
    } catch (error){
        if (error.isJoi === true) error.status = 422
        next(error)
    }
})

router.post('/login', async (req, res, next) => {
    try {
        const result = await authSchema.validateAsync(req.body)
        const user = await Alien.findOne({ email: result.email })

        if (!user) throw createError.NotFound('User not registered')

        const isMatch = await user.isValidPassword(result.password)
        if (!isMatch) throw createError.Unauthorized('Username/password is invalid')

        const accessToken = await signAccessToken(user.id)
        const refreshToken = await signRefreshToken(user.id)
        res.send({ accessToken, refreshToken })

    } catch (error) {
        if (error.isJoi === true)
            return next(createError.BadRequest("Invalid Username/Password"))
        next(error)
    }
})

router.post('/refresh-token', async (req, res, next) => {
    try {
        const { refreshToken } = req.body
        if (!refreshToken) throw createError.BadRequest()
        const userId = await verifyRefreshToken(refreshToken)

        const accessToken = await signAccessToken(userId)
        // const refToken = await RefreshToken(userId)
        // res.send({ accessToken: accessToken, refreshToken: refToken })
        res.send({ accessToken: accessToken})

    } catch (error) {
        next(error)

    }
})

module.exports = router;
