const express = require('express')
const {signAccessToken, signRefreshToken, verifyRefreshToken, verifyAccessToken} = require("../helpers/jwt_helpers")
const router = express.Router()

// importing subject schema
const Unit = require("../models/unit");

//GET API
router.get('/',async(req,res) =>{
    try{
        //console.log(req.headers['authorization'])
        const units =  await Unit.find()
        res.json(units)
        //res.json("All subjects are: " + subjects)
    }
    catch(err){
        res.send('Error ' + err)
    }
})

//GET UNIT BY ID API
router.get('/:id',verifyAccessToken,async(req,res) =>{
    try{
        const unit =  await Unit.findById(req.params.id)
        res.json(unit)
    }
    catch(err){
        res.send("Error found getting subject by ID " + err)
    }
})

//GET UNIT ID BY UNIT NAME
router.get('/unitName/:unit_name',async(req,res) =>{
    try{
        const unit =  await Unit.findOne({unit_name: req.params.unit_name})
        res.json(unit._id)
    }
    catch(err){
        res.send("Error found getting subject by ID " + err)
    }
})

//GET UNIT NAME BY ID API
router.get('/:id/unit_name', async(req,res) =>{
    try{
        const unit =  await Unit.findById(req.params.id)
        res.json(unit.unit_name)
    }
    catch(err){
        res.send("Error found getting subject by ID " + err)
    }
})

//Addition by minal-temporary
// GET units by subject ID and class ID
router.get('/subject/:subjectID/class/:classID', /*verifyAccessToken,*/ async(req, res) => {
    try {
      const units = await Unit.find({ subject_id: req.params.subjectID, class_id: req.params.classID});
      res.json(units);
    } catch(err) {
      res.send('Error ' + err);
    }
  });
  
  
//PUT API
router.put('/:id',verifyAccessToken, async(req,res) =>{
    try{
        const unit = await Unit.findById(req.params.id)
        unit.unit_name = req.body.unit_name
        const u1 = await unit.save()
        res.json(u1)
    }
    catch(err){
        res.send('Error on put')
    }
})
//POST API
router.post('/', async(req,res) => {
    const unit = new Unit({
        _id : req.body.unit_id,
        unit_name: req.body.unit_name,
        class_id: req.body.class_id ,
        subject_id: req.body.subject_id
    })
    try{
        const u1 = await unit.save()
        res.json(u1)
    }catch(err){
        res.send('Error on creating subject' + err)
    }

})
//DELETE API
router.delete('/:id',verifyAccessToken,async(req,res) =>{
    try{
        const unit = await Unit.findById(req.params.id)
        unit_name = req.body.unit_name
        const u1 = await unit.remove ()
        res.json(u1)
    }
    catch(err){
        res.send('Error on deleting')
    }
}) 
module.exports = router