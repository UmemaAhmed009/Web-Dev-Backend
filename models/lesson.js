const mongoose = require('mongoose');
const Unit = require("../models/unit");

const lesson_schema = new mongoose.Schema({
    _id:
    {
        type: Number,
        required: true
    },
    unit_id:
    {
        type: mongoose.Schema.Types.Number ,
        required: true,
        ref: 'Unit'
    },
    lesson_name:
    {
        type: String,
        required: true,
    },
    lesson_details:{
        type: String,
        //required: true,
    },
    lesson_image: {
        type: String,
        required: true,
    }
})
module.exports = mongoose.model("Lesson", lesson_schema);