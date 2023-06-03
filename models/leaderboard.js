const mongoose = require('mongoose');
//const Student = require("../models/student");
//const Progress = require("../models/progress");


const AutoIncrement = require('mongoose-sequence')(mongoose);

const leaderboard_schema = new mongoose.Schema({
    _id:
    {
        type: Number,
        required: true
    },
    user_id:
    {
        type: mongoose.Schema.Types.Number,
        required: true,
        ref: 'Student'
    },
    progress_id:
    {
        type: mongoose.Schema.Types.Number,
        required: true,
        ref: 'Progress'
    },
    unit_progress:
    {
        type: String,
        required: true,
        ref: 'Progress'
    },
    time_taken:
    {
        type: mongoose.Schema.Types.Number,
        required: true,
    },
    total_tries:{
        type: Number

    },
    rank:
    {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model("Leaderboard", leaderboard_schema);