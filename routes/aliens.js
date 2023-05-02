const express = require('express')
const router = express.Router()
const Alien = require('../models/alien')

router.get('/',async(req,res) =>{
    try{
        const aliens =  await Alien.find()
        res.json(aliens)
    }
    catch(err){
        res.send('Error ' + err)
    }
})
//GET API
router.get('/:id',async(req,res) =>{
    try{
        const alien =  await Alien.findById(req.params.id)
        res.json(alien)
    }
    catch(err){
        res.send('Error ' + err)
    }
})
//PUT API
router.put('/:id',async(req,res) =>{
    try{
        const alien = await Alien.findById(req.params.id)
        alien.name = req.body.name
        const a1 = await alien.save()
        res.json(a1)
    }
    catch(err){
        res.send('Error on put')
    }
})
//POST API
router.post('/', async(req,res) => {
    const alien = new Alien({
        name: req.body.name,
        tech: req.body.tech,
        sub: req.body.sub
    })
    try{
        const a1 = await alien.save()
        res.json(a1)
    }catch(err){
        res.send('Error on post' + err)
    }

})
//DELETE API
router.delete('/:id',async(req,res) =>{
    try{
        const alien = await Alien.findById(req.params.id)
        alien.sub = req.body.sub
        const a1 = await alien.remove ()
        res.json(a1)
    }
    catch(err){
        res.send('Error')
    }
})

module.exports= router