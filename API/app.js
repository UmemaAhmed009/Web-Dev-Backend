//GET: https://localhost:9000/aliens
const express = require('express');
const { MongoServerClosedError } = require('mongodb');
const mongoose = require('mongoose');
const createError = require('http-errors')
const { verifyAccessToken } = require('./helpers/jwthelpers')
const env = require("dotenv").config();
const url = 'mongodb://127.0.0.1/AlienDBex';
const user = require("./models/alien");

const app = express();
mongoose.set("strictQuery", false);
mongoose.connect(url, {useNewUrlParser: true});
const con = mongoose.connection;
con.on('open', ()=> {
    console.log('Connected..');
})

app.use(express.json())



const alienRouter = require('./routes/aliens')
app.use('/aliens', alienRouter)

app.listen(3000, function(){
    console.log('Server started')
})