const mongoose = require('mongoose');
const Lesson = require("../models/lesson");

const question_schema = new mongoose.Schema({
    _id:
    {
        type: Number,
        required: true
    },
    lesson_id:
    {
        type: mongoose.Schema.Types.Number,
        required: true,
        ref: 'Lesson'
    },
    question_details:
    {
        type: String,
        required: true
    },
    answers:{
        type: Array,
        required: true,
        ref: 'Subject'
    }
})
module.exports = mongoose.model("Question", question_schema);