const express = require('express')
const {signAccessToken, signRefreshToken, verifyRefreshToken, verifyAccessToken} = require("../helpers/jwt_helpers")
const router = express.Router()

// importing question schema
const Question = require("../models/question");

//GET API
router.get('/',async(req,res) =>{
    try{
        //console.log(req.headers['authorization'])
        const questions =  await Question.find()
        res.json(questions)
    }
    catch(err){
        res.send('Error ' + err)
    }
})

//GET SUBJECT BY ID API
router.get('/:id',verifyAccessToken,async(req,res) =>{
    try{
        const question =  await Question.findById(req.params.id)
        res.json(question)
    }
    catch(err){
        res.send("Error found getting question by ID " + err)
    }
})

router.get('/lesson/:lesson_id', /*verifyAccessToken,*/ async(req, res) => {
    try {
      const questions = await Question.find({ lesson_id: req.params.lesson_id});
      res.json(questions);
    } catch(err) {
      res.send('Error ' + err);
    }
  });

//PUT API
router.put('/:id',verifyAccessToken, async(req,res) =>{
    try{
        const question = await Question.findById(req.params.id)
        question.question_name = req.body.question_name
        const q1 = await question.save()
        res.json(q1)
    }
    catch(err){
        res.send('Error on PUT API of question')
    }
})
//POST API
router.post('/', async(req,res) => {
    const question = new Question({
        _id: req.body.question_id,
        lesson_id : req.body.lesson_id,
        question_details: req.body.question_details,
        answers: req.body.answers,
        question_image: req.body.question_image
    })
    try{
        const q1 = await question.save()
        res.json(q1)
    }catch(err){
        res.send('Error on creating question' + err)
    }

})
//DELETE API
router.delete('/:id',verifyAccessToken,async(req,res) =>{
    try{
        const question = await Question.findById(req.params.id)
        question_name = req.body.question_name
        const q1 = await question.remove ()
        res.json(q1)
    }
    catch(err){
        res.send('Error on deleting question')
    }
}) 
module.exports = router