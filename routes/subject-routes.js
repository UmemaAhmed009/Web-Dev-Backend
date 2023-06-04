const express = require('express')
const {signAccessToken, signRefreshToken, verifyRefreshToken, verifyAccessToken} = require("../helpers/jwt_helpers")
const router = express.Router()

// importing subject schema
const Subject = require("../models/subject");

//GET API
router.get('/',async(req,res) =>{
    try{
        //console.log(req.headers['authorization'])
        const subjects =  await Subject.find()
        res.json(subjects)
    }
    catch(err){
        res.send('Error ' + err)
    }
})

//GET SUBJECT BY ID API
router.get('/:id',/*verifyAccessToken,*/async(req,res) =>{
    try{
        const subject =  await Subject.findById(req.params.id)
        res.json(subject)
    }
    catch(err){
        res.send("Error found getting subject by ID " + err)
    }
})

//GET SUBJECT ID BY NAME
router.get('/subjectName/:subject_name',async(req,res) =>{
    try{
        const subject =  await Subject.findOne({subject_name: req.params.subject_name})
        res.json(subject._id)
    }
    catch(err){
        res.send("Error found getting subject by ID " + err)
    }
})

//GET SUBJECT NAME BY ID API
router.get('/:id/subject_name',/*verifyAccessToken,*/async(req,res) =>{
    try{
        const subject =  await Subject.findById(req.params.id)
        res.json(subject.subject_name)
    }
    catch(err){
        res.send("Error found getting subject by ID " + err)
    }
})


//PUT API
router.put('/:id',verifyAccessToken, async(req,res) =>{
    try{
        const subject = await Subject.findById(req.params.id)
        subject.subject_name = req.body.subject_name
        const s1 = await subject.save()
        res.json(s1)
    }
    catch(err){
        res.send('Error on put')
    }
})
//POST API
router.post('/', async(req,res) => {
    const subject = new Subject({
        _id: req.body.subject_id,
        subject_name: req.body.subject_name,
    })
    try{
        const s1 = await subject.save()
        res.json(s1)
    }catch(err){
        res.send('Error on creating subject' + err)
    }

})
//DELETE API
router.delete('/:id',verifyAccessToken,async(req,res) =>{
    try{
        const subject = await user.findById(req.params.id)
        subject_name = req.body.subject_name
        const s1 = await subject.remove ()
        res.json(s1)
    }
    catch(err){
        res.send('Error on deleting')
    }
}) 
module.exports = router