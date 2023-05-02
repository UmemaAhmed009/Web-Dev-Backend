const mongoose= require('mongoose');
const Student = require("../models/student");
const Subject = require("../models/subject");
const Class = require("../models/class");
const Unit = require("../models/unit");
const Lesson = require("../models/lesson");
const Question = require("../models/question");

//progressID, studentID, subjects[subjectID, classes[classID, units[unitID, unitProgress, completedlessons, totallessons, 
// unitStartedAt, isCompleted, unitCompletedAt, lessons[lessonID, lessonProgress, correctAnswers, totalQuestions, isCompleted, lessonCompletedAt, answerStatus[questionID, isCorrect]]]]]

const ProgressSchema = mongoose.Schema({
    _id:
    {
        type: Number,
        required: true
    },
    student_id:{
        type: mongoose.Schema.Types.Number,
        required: true,
        ref:'Student'
    },
    subjects:[{
        _id:{
            type: mongoose.Schema.Types.Number,
            required: true,
            ref:'Subject'
        },
        classes:[{
            _id:{
                type: mongoose.Schema.Types.Number,
                required: true,
                ref:'Class'
            },
            units:[{
                _id:{
                    type: mongoose.Schema.Types.Number,
                    required: true,
                    ref:'Unit'
                },
                unit_progress:{
                    type: Number,
                },
                completed_lessons:{
                    type: Number
                },
                total_lessons:{
                    type: Number
                },
                unit_started_at:{
                    type:Date,
                    default:Date.now
                },
                is_completed:{
                    type:Boolean,
                    default:false
                },
                unit_completed_at:{
                    type:Date
                },
                lessons:[{
                    _id:{
                        type: mongoose.Schema.Types.Number,
                        required: true,
                        ref:'Lesson'
                    },
                    lesson_progress:{
                        type:Number
                    },
                    correct_answers:{
                        type:Number
                    },
                    total_questions:{
                        type:Number
                    },
                    is_completed:{
                        type:Boolean,
                        default:false
                    },
                    lesson_completed_at:{
                        type:Date
                    },
                    answer_status:[{
                        _id:{
                            type: mongoose.Schema.Types.Number,
                            required: true,
                            ref:'Question'
                        },
                        is_correct:{
                            type: Boolean,
                            default: false
                        }
                    }]
                }]

            }]

        }]
    }]

})

module.exports = mongoose.model('Progress',ProgressSchema);