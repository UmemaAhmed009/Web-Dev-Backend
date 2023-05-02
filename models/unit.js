const mongoose = require('mongoose');
const Subject = require("../models/subject");
const Class = require("../models/class");

const unit_schema = new mongoose.Schema({
    _id:
    {
        type: Number,
        required: true
    },
    unit_name:
    {
        type: String,
        required: true
    },
    class_id:
    {
        type: mongoose.Schema.Types.Number,
        required: true,
        ref: 'Class'
    },
    subject_id:{
        type: mongoose.Schema.Types.Number,
        required: true,
        ref: 'Subject'
    }
})
module.exports = mongoose.model("Unit", unit_schema);