const express = require('express')
const {signAccessToken, signRefreshToken, verifyRefreshToken, verifyAccessToken} = require("../helpers/jwt_helpers")
const router = express.Router()

// importing class schema
const Class = require("../models/class");

//GET API
router.get('/',async(req,res) =>{
    try{
        //console.log(req.headers['authorization'])
        const classes =  await Class.find()
        res.json(classes)
    }
    catch(err){
        res.send('Error ' + err)
    }
})

//GET SUBJECT BY ID API
router.get('/:id',verifyAccessToken,async(req,res) =>{
    try{
        const classes =  await Class.findById(req.params.id)
        res.json(classes)
    }
    catch(err){
        res.send("Error found getting class by ID " + err)
    }
})

//GET CLASSS ID BY CLASS NAME
router.get('/className/:class_name',async(req,res) =>{
    try{
        const classObj =  await Class.findOne({class_name: req.params.class_name})
        res.json(classObj._id)
    }
    catch(err){
        res.send("Error found getting subject by ID " + err)
    }
})

//PUT API
router.put('/:id',verifyAccessToken, async(req,res) =>{
    try{
        const classes = await Class.findById(req.params.id)
        classes.class_name = req.body.class_name
        const c1 = await classes.save()
        res.json(c1)
    }
    catch(err){
        res.send('Error on put in class schema')
    }
})
//POST API
router.post('/', async(req,res) => {
    const classes = new Class({
        _id: req.body.class_id,
        class_name: req.body.class_name,
    })
    try{
        const c1 = await classes.save()
        res.json(c1)
    }catch(err){
        res.send('Error on creating class' + err)
    }

})
//DELETE API
router.delete('/:id',verifyAccessToken,async(req,res) =>{
    try{
        const classes = await Class.findById(req.params.id)
        classes.class_name = req.body.class_name
        const c1 = await classes.remove()
        res.json(c1)
    }
    catch(err){
        res.send('Error on deleting class')
    }
}) 
module.exports = router