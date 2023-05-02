const express = require('express')
const {signAccessToken, signRefreshToken, verifyRefreshToken, verifyAccessToken} = require("../helpers/jwt_helpers")
const router = express.Router()

// importing lesson schema
const Lesson = require("../models/lesson");

//GET API
router.get('/',async(req,res) =>{
    try{
        //console.log(req.headers['authorization'])
        const lessons =  await Lesson.find()
        res.json(lessons)
    }
    catch(err){
        res.send('Error ' + err)
    }
})

//GET LESSON BY ID API
router.get('/:id',verifyAccessToken,async(req,res) =>{
    try{
        const lesson =  await Lesson.findById(req.params.id)
        res.json(lesson)
    }
    catch(err){
        res.send("Error found getting subject by ID " + err)
    }
})

//get Lesson id by lesson name
router.get('/lessonName/:lesson_name',async(req,res) =>{
    try{
        const lesson =  await Lesson.findOne({lesson_name: req.params.lesson_name})
        res.json(lesson._id)
    }
    catch(err){
        res.send("Error found getting subject by ID " + err)
    }
})

// GET units by subject ID and class ID
// router.get('/subject/:subjectID/class/:classID', /*verifyAccessToken,*/ async(req, res) => {
//     try {
//       const units = await Unit.find({ subject_id: req.params.subjectID, class_id: req.params.classID});
//       res.json(units);
//     } catch(err) {
//       res.send('Error ' + err);
//     }
//   });

  // GET lessons by unit ID
router.get('/unit/:unit_id', /*verifyAccessToken,*/ async(req, res) => {
    try {
      const lessons = await Lesson.find({ unit_id: req.params.unit_id});
      res.json(lessons);
    } catch(err) {
      res.send('Error ' + err);
    }
  });

//PUT API
router.put('/:id',verifyAccessToken, async(req,res) =>{
    try{
        const lesson = await Lesson.findById(req.params.id)
        lesson.lesson_name = req.body.lesson_name
        const l1 = await lesson.save()
        res.json(l1)
    }
    catch(err){
        res.send('Error on put')
    }
})
//POST API
router.post('/', async(req,res) => {
    const lesson = new Lesson({
        _id: req.body.lesson_id,
        lesson_name: req.body.lesson_name,
        unit_id : req.body.unit_id,
        lesson_details: req.body.lesson_details
    })
    try{
        const l1 = await lesson.save()
        res.json(l1)
    }catch(err){
        res.send('Error on creating lesson' + err)
    }

})
//DELETE API
router.delete('/:id',verifyAccessToken,async(req,res) =>{
    try{
        const lesson = await Lesson.findById(req.params.id)
        lesson_name = req.body.lesson_name
        const l1 = await lesson.remove ()
        res.json(l1)
    }
    catch(err){
        res.send('Error on deleting')
    }
}) 
module.exports = router