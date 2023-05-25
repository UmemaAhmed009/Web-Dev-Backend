const mongoose = require('mongoose');
const subject_schema = new mongoose.Schema({
    _id:
    {
        type: Number,
        required: true
    },
    subject_name:
    {
        type: String,
        required: true
    }
})
module.exports = mongoose.model("Subject", subject_schema);