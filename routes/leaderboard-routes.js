const express = require('express')
const {signAccessToken, signRefreshToken, verifyRefreshToken, verifyAccessToken} = require("../helpers/jwt_helpers")
const router = express.Router()

// importing leaderboard schema
const Leaderboard = require("../models/leaderboard");

//GET API
router.get('/',async(req,res) =>{
    try{
        //console.log(req.headers['authorization'])
        const leaderboards =  await Leaderboard.find()
        res.json(leaderboards)
    }
    catch(err){
        res.send('Error ' + err)
    }
})

//GET LEADERBOARD BY ID API
router.get('/:id',verifyAccessToken,async(req,res) =>{
    try{
        const leaderboard =  await Leaderboard.findById(req.params.id)
        res.json(leaderboard)
    }
    catch(err){
        res.send("Error found getting leaderboard by ID " + err)
    }
})
//PUT API
router.put('/:id',verifyAccessToken, async(req,res) =>{
    try{
        const leaderboard = await leaderboard.findById(req.params.id)
        leaderboard.rank = req.body.rank
        const l1 = await leaderboard.save()
        res.json(l1)
    }
    catch(err){
        res.send('Error on put in leaderboard schema')
    }
})
//POST API
router.post('/',verifyAccessToken, async(req,res) => {
    const leaderboard = new Leaderboard({
        _id: req.body.leaderboard_id,
        student_id: req.body.student_id,
        progress_id: req.body.progress_id,
        unit_progress : req.body.unit_progress,
        time_taken : req.body.time_taken,
        rank : req.body.rank
    })
    try{
        const l1 = await leaderboard.save()
        res.json(l1)
    }catch(err){
        res.send('Error on creating leaderboard' + err)
    }

})
//DELETE API
router.delete('/:id',verifyAccessToken,async(req,res) =>{
    try{
        const leaderboard = await Leaderboard.findById(req.params.id)
        leaderboard.progress_id = req.body.progress_id
        const l1 = await leaderboard.remove()
        res.json(l1)
    }
    catch(err){
        res.send('Error on deleting leaderboard')
    }
}) 
module.exports = router