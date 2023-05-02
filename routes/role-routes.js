const express = require('express')
const {signAccessToken, signRefreshToken, verifyRefreshToken, verifyAccessToken} = require("../helpers/jwt_helpers")
const router = express.Router()

// importing role schema
const Role = require("../models/role");

//GET API
router.get('/',async(req,res) =>{
    try{
        //console.log(req.headers['authorization'])
        const roles =  await Role.find()
        res.json(roles)
    }
    catch(err){
        res.send('Error ' + err)
    }
})

//GET ROLE BY ID API
router.get('/:id',verifyAccessToken,async(req,res) =>{
    try{
        const roles =  await Role.findById(req.params.id)
        res.json(roles)
    }
    catch(err){
        res.send("Error found getting role by ID " + err)
    }
})
//PUT API
router.put('/:id',verifyAccessToken, async(req,res) =>{
    try{
        const roles = await Role.findById(req.params.id)
        roles.role_name = req.body.role_name
        const r1 = await roles.save()
        res.json(r1)
    }
    catch(err){
        res.send('Error on put in role schema')
    }
})
//POST API
router.post('/', async(req,res) => {
    const roles = new Role({
        _id: req.body.role_id,
        role_name: req.body.role_name,
    })
    try{
        const r1 = await roles.save()
        res.json(r1)
    }catch(err){
        res.send('Error on creating role' + err)
    }

})
//DELETE API
router.delete('/:id',verifyAccessToken,async(req,res) =>{
    try{
        const roles = await Role.findById(req.params.id)
        roles.role_name = req.body.role_name
        const r1 = await roles.remove()
        res.json(r1)
    }
    catch(err){
        res.send('Error on deleting role')
    }
}) 

module.exports = router