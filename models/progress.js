const mongoose= require('mongoose');
const Student = require("../models/student");
const Subject = require("../models/subject");
const Class = require("../models/class");
const Unit = require("../models/unit");
const Lesson = require("../models/lesson");
const Question = require("../models/question");

const AutoIncrement = require('mongoose-sequence')(mongoose);

//progressID, studentID, subjects[subjectID, classes[classID, units[unitID, unitProgress, completedlessons, totallessons, 
// unitStartedAt, isCompleted, unitCompletedAt, lessons[lessonID, lessonProgress, correctAnswers, totalQuestions, isCompleted, lessonCompletedAt, answerStatus[questionID, isCorrect]]]]]

const ProgressSchema = mongoose.Schema({
    _id:
    {
        type: Number,
        name: String

    },
    user_id:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'User'
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
                    default: 0,
                },
                completed_lessons:{
                    type: Number,
                    default: 0,
                },
                total_lessons:{
                    type: Number,
                    default: 0,
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
                        type:Number,
                        default: 0,
                    },
                    correct_answers:{
                        type:Number,
                        default: 0,
                    },
                    total_questions:{
                        type:Number,
                        default: 0,
                    },
                    total_tries:{
                        type:Number,
                        default: 0,
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
                        },
                        tries:{
                            type: Number,
                            default: 0
                        }
                    }]
                }]

            }]

        }]
    }]

}, { _id: false })
ProgressSchema.plugin(AutoIncrement);
// ProgressSchema.plugin(AutoIncrement, {inc_field: 'id'});

// Middleware to update total_lessons, total_questions, and total_tries before saving
ProgressSchema.pre('save', async function (next) {
    const units = this.subjects.reduce(
      (accum, subject) =>
        accum.concat(subject.classes.flatMap((cls) => cls.units)),
      []
    );
  
    for (const unit of units) {
      // Update total_lessons for each unit
      const lessonCount = await Lesson.countDocuments({ unit_id: unit._id });
      unit.total_lessons = lessonCount;
  
      for (const lesson of unit.lessons) {
        // Update total_questions for each lesson
        const questionCount = await Question.countDocuments({ lesson_id: lesson._id });
        lesson.total_questions = questionCount;
  
        // Calculate total_tries for each lesson
        let totalTries = lesson.answer_status.reduce((accum, answer) => accum + answer.tries, 0);
        lesson.total_tries = totalTries;
      }
    }
  
    next();
  });
  


// // Middleware to update total_lessons and total_questions before saving
// ProgressSchema.pre('save', async function (next) {
//     const units = this.subjects.reduce(
//       (accum, subject) =>
//         accum.concat(subject.classes.flatMap((cls) => cls.units)),
//       []
//     );
  
//     for (const unit of units) {
//       // Update total_lessons for each unit
//       const lessonCount = await Lesson.countDocuments({ unit_id: unit._id });
//       unit.total_lessons = lessonCount;
  
//       for (const lesson of unit.lessons) {
//         // Update total_questions for each lesson
//         const questionCount = await Question.countDocuments({ lesson_id: lesson._id });
//         lesson.total_questions = questionCount;
//       }
//     }
  
//     next();
//   });
  

// // Middleware to update total_lessons before saving
// ProgressSchema.pre('save', async function (next) {
//     const units = this.subjects.reduce(
//       (accum, subject) => accum.concat(subject.classes.flatMap((cls) => cls.units)),
//       []
//     );
  
//     // Update total_lessons for each unit
//     for (const unit of units) {
//       const lessonCount = await Lesson.countDocuments({ unit_id: unit._id });
//       unit.total_lessons = lessonCount;
//     }
  
//     next();
//   });


//FOR RESETING THE COUNTER, this works 100%
// const Progress = mongoose.model('Progress', ProgressSchema);

// // Reset the counter for _id field in Progress model
// Progress.counterReset('_id', function(err) {
//   if (err) {
//     console.error(err);
//     return;
//   }

//   console.log('Counter reset successfully for _id field in Progress model.');
// });
module.exports = mongoose.model('Progress',ProgressSchema);