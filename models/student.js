const mongoose = require('mongoose');

const student_schema = new mongoose.Schema({
    _id:
    {
        type: Number,
        required: true
    },
    name:
    {
        type: String,
        required: true
    },
    age:
    {
        type: Number,
        required: true
    }
})
module.exports = mongoose.model("Student", student_schema);