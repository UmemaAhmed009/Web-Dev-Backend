const mongoose = require('mongoose');

const class_schema = new mongoose.Schema({
    _id:
    {
        type: Number,
        required: true
    },
    class_name:
    {
        type: String,
        required: true
    }
})
module.exports = mongoose.model("Class", class_schema);