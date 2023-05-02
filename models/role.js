const mongoose = require('mongoose');

const role_schema = new mongoose.Schema({
    _id:
    {
        type: Number,
        required: true
    },
    role_name:
    {
        type: String,
        required: true
    }
})
module.exports = mongoose.model("Role", role_schema);