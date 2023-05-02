const express = require('express')
const {signAccessToken, signRefreshToken, verifyRefreshToken, verifyAccessToken} = require("../helpers/jwt_helpers")
const router = express.Router()

// importing schema
const Progress = require("../models/progress");
const Student = require("../models/student");
const Subject = require("../models/subject");
const Class = require("../models/class");
const Unit = require("../models/unit");
const Lesson = require("../models/lesson");
const Question = require("../models/question");

//GET API
router.get('/',async(req,res) =>{
    try{
        //console.log(req.headers['authorization'])
        const progress =  await Progress.find()
        res.json(progress)
    }
    catch(err){
        res.send('Error ' + err)
    }
})

//GET PROGRESS BY ID API
router.get('/:id',async(req,res) =>{
    try{
        const progress =  await Progress.findById(req.params.id)
        res.json(progress)
    }
    catch(err){
        res.send("Error found getting progress by ID " + err)
    }
})


//POST API, would create progress_id+student_id only
router.post('/', (req, res, next) => {
    const progress = new Progress({
        _id: req.body.progress_id,
        student_id: req.body.student_id
        });
    progress
        .save()
        .then(result =>{
            console.log(result);
            res.status(201).json({
                message: 'Progress created',
                createdProgress: result
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error:err
            });
        })
});

//POST API, requires all attributes in the request body
router.post('/post-all', async (req, res) => {
try {
    const { progress_id, student_id, subjects } = req.body;

    const progress = new Progress({
    _id: progress_id,
    student_id: student_id,
    subjects: subjects.map(subject => ({
        _id: subject.subject_id,
        classes: subject.classes.map(classItem => ({
        _id: classItem.class_id,
        units: classItem.units.map(unit => ({
            _id: unit.unit_id,
            unit_progress: unit.unit_progress,
            completed_lessons: unit.completed_lessons,
            total_lessons: unit.total_lessons,
            is_completed: unit.is_completed,
            unit_completed_at: unit.unit_completed_at,
            lessons: unit.lessons.map(lesson => ({
            _id: lesson.lesson_id,
            lesson_progress: lesson.lesson_progress,
            correct_answers: lesson.correct_answers,
            total_questions: lesson.total_questions,
            is_completed: lesson.is_completed,
            lesson_completed_at: lesson.lesson_completed_at,
            answer_status: lesson.answer_status.map(answer => ({
                _id: answer.question_id,
                is_correct: answer.is_correct
            }))
            }))
        }))
        }))
    }))
    });

    await progress.save();
    res.status(201).json({
    message: 'Progress created successfully',
    progress: progress
    });
} catch (err) {
    res.status(400).json({ message: err.message });
}
});


//PUT API, requires all attributes in the body
router.put('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { subjects } = req.body;
  
      const updatedProgress = await Progress.findOneAndUpdate(
        { _id: id },
        {
          $set: {
            subjects: subjects.map(subject => ({
              _id: subject.subject_id,
              classes: subject.classes.map(classItem => ({
                _id: classItem.class_id,
                units: classItem.units.map(unit => ({
                  _id: unit.unit_id,
                  unit_progress: unit.unit_progress,
                  completed_lessons: unit.completed_lessons,
                  total_lessons: unit.total_lessons,
                  is_completed: unit.is_completed,
                  unit_completed_at: unit.unit_completed_at,
                  lessons: unit.lessons.map(lesson => ({
                    _id: lesson.lesson_id,
                    lesson_progress: lesson.lesson_progress,
                    correct_answers: lesson.correct_answers,
                    total_questions: lesson.total_questions,
                    is_completed: lesson.is_completed,
                    lesson_completed_at: lesson.lesson_completed_at,
                    answer_status: lesson.answer_status.map(answer => ({
                      _id: answer.question_id,
                      is_correct: answer.is_correct
                    }))
                  }))
                }))
              }))
            }))
          }
        },
        { new: true }
      );
  
      res.json({ message: 'Progress updated successfully', progress: updatedProgress });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
});


//PUT API to add a new object to subjects array
router.put('/:progressId/subject', async (req, res) => {
    try {
      const progressId = req.params.progressId;

      const subjectId = req.body.subject_id;

      const progress = await Progress.findById(progressId);
  
      if (!progress) {
        return res.status(404).json({ error: 'Progress not found' });
      }
  

      const subject_find = await Subject.findById(subjectId);

       if (!subject_find) {
        return res.status(404).json({ error: 'Subject not found' });
       }

      const subject = progress.subjects.id(subjectId);
      
      if (!subject) {
        progress.subjects.push({
            _id: subjectId,
            classes: [],
          });
      }

      await progress.save();
  
      res.json({ message: 'Subject added successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
});


//PUT API to add a new object to classes array
router.put('/:progressId/subject/:subjectId/class', async (req, res) => {
    try {
      const progressId = req.params.progressId;
      const subjectId = req.params.subjectId;

      const classId = req.body.class_id;

      const progress = await Progress.findById(progressId);
  
      if (!progress) {
        return res.status(404).json({ error: 'Progress not found' });
      }
  
      const subject = progress.subjects.id(subjectId);
  
      if (!subject) {
        return res.status(404).json({ error: 'Subject not found' });
      }
  

      const class_find = await Class.findById(classId);

       if (!class_find) {
        return res.status(404).json({ error: 'Class not found' });
       }

      const classObj = subject.classes.id(classId);
      
      if (!classObj) {
        subject.classes.push({
            _id: classId,
            units: [],
          });
      }

      await progress.save();
  
      res.json({ message: 'Class added successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
});


//PUT API to add a new object to units array or to update an object in units array
router.put('/:progressId/subject/:subjectId/class/:classId/unit', async (req, res) => {
    try {
      const progressId = req.params.progressId;
      const subjectId = req.params.subjectId;
      const classId = req.params.classId;

      const unitId = req.body.unit_id;
      const unitProgress= req.body.unit_progress;
      const completedLessons= req.body.completed_lessons;
      const totalLessons= req.body.total_lessons;
      const isCompleted= req.body.is_completed;
      const unitCompletedAt= req.body.unit_completed_at;
  
      const progress = await Progress.findById(progressId);
  
      if (!progress) {
        return res.status(404).json({ error: 'Progress not found' });
      }
  
      const subject = progress.subjects.id(subjectId);
  
      if (!subject) {
        return res.status(404).json({ error: 'Subject not found' });
      }
  
      const classObj = subject.classes.id(classId);
  
      if (!classObj) {
        return res.status(404).json({ error: 'Class not found' });
      }


      const unit_find = await Unit.findById(unitId);

       if (!unit_find) {
        return res.status(404).json({ error: 'Unit not found' });
       }

      const unit = classObj.units.id(unitId);
      
      if (!unit) {
        classObj.units.push({
            _id: unitId,
            unit_progress: unitProgress,
            completed_lessons: completedLessons,
            total_lessons: totalLessons,
            is_completed: isCompleted,
            unit_completed_at: unitCompletedAt,
            lessons: [],
          });
      } else {
            unit.unit_progress=unitProgress;
            unit.completed_lessons=completedLessons;
            unit.total_lessons=totalLessons;
            unit.is_completed=isCompleted;
            unit.unit_completed_at= unitCompletedAt;
      }

      await progress.save();
  
      res.json({ message: 'Unit added successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
});


//PUT API to add a new object to lessons array or to update an object in lessons array
router.put('/:progressId/subject/:subjectId/class/:classId/unit/:unitId/lesson', async (req, res) => {
    try {
      const progressId = req.params.progressId;
      const subjectId = req.params.subjectId;
      const classId = req.params.classId;
      const unitId = req.params.unitId;
  
      const lessonId = req.body.lesson_id;
      const lessonProgress= req.body.lesson_progress;
      const correctAnswers= req.body.correct_answers;
      const totalQuestions= req.body.total_questions;
      const isCompleted= req.body.is_completed;
      const lessonCompletedAt= req.body.lesson_completed_at;
  
      const progress = await Progress.findById(progressId);
  
      if (!progress) {
        return res.status(404).json({ error: 'Progress not found' });
      }
  
      const subject = progress.subjects.id(subjectId);
  
      if (!subject) {
        return res.status(404).json({ error: 'Subject not found' });
      }
  
      const classObj = subject.classes.id(classId);
  
      if (!classObj) {
        return res.status(404).json({ error: 'Class not found' });
      }
  
      const unit = classObj.units.id(unitId);
  
      if (!unit) {
        return res.status(404).json({ error: 'Unit not found' });
      }

      const lesson_find = await Lesson.findById(lessonId);

       if (!lesson_find) {
        return res.status(404).json({ error: 'Lesson not found' });
       }

      const lesson = unit.lessons.id(lessonId);
      
      if (!lesson) {
        unit.lessons.push({
            _id: lessonId,
            lesson_progress: lessonProgress,
            correct_answers: correctAnswers,
            total_questions: totalQuestions,
            is_completed: isCompleted,
            lesson_completed_at: lessonCompletedAt,
            answer_status: [],
          });
      } else {
            lesson.lesson_progress=lessonProgress;
            lesson.correct_answers=correctAnswers;
            lesson.total_questions=totalQuestions;
            lesson.is_completed=isCompleted;
            lesson.lesson_completed_at= lessonCompletedAt;
      }

      await progress.save();
  
      res.json({ message: 'Lesson added successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
});
  

//PUT API to add a new object to answer_status array or to update an object in answer_status
router.put('/:progressId/subject/:subjectId/class/:classId/unit/:unitId/lesson/:lessonId/answer_status', async (req, res) => {
  try {
    const progressId = req.params.progressId;
    const subjectId = req.params.subjectId;
    const classId = req.params.classId;
    const unitId = req.params.unitId;
    const lessonId = req.params.lessonId;
    const questionId = req.body.question_id;
    const isCorrect = req.body.is_correct;
    
    const progress = await Progress.findById(progressId);
    
    if (!progress) {
      return res.status(404).json({ error: 'Progress not found' });
    }

    const subject = progress.subjects.id(subjectId);

    if (!subject) {
      return res.status(404).json({ error: 'Subject not found' });
    }

    const classObj = subject.classes.id(classId);

    if (!classObj) {
      return res.status(404).json({ error: 'Class not found' });
    }

    const unit = classObj.units.id(unitId);

    if (!unit) {
      return res.status(404).json({ error: 'Unit not found' });
    }

    const lesson = unit.lessons.id(lessonId);

    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found' });
    }

    const question = await Question.findById(questionId);

    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    const answerStatus = lesson.answer_status.id(questionId);

    if (!answerStatus) {
      lesson.answer_status.push({
        _id: questionId,
        is_correct: isCorrect,
      });
    } else {
      answerStatus.is_correct = isCorrect;
    }

    await progress.save();

    res.json({ message: 'Answer status updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});


//DELETE API for progress
router.delete('/:id',async(req,res) =>{
    try{
        const progress = await Progress.findById(req.params.id)
        const p1 = await progress.remove ()
        res.json(p1)
    }
    catch(err){
        res.send('Error on deleting')
    }
}) 

// //DELETE API for deleting an object from answer_status array based on the question id ad other ids
// router.delete('/:progressID/subject/:subjectID/class/:classID/unit/:unitID/lesson/:lessonID/answer_status/:questionID', async (req, res) => {
//     try {
//         const progress = await Progress.findById(req.params.progressID);
//         if (!progress) {
//             return res.status(404).send("Progress not found");
//         }
//         const subject = progress.subjects.find(s => s._id.toString() === req.params.subjectID.toString());
//         if (!subject) {
//             return res.status(404).send("Subject not found");
//         }
//         const classObj = subject.classes.find(c => c._id.toString() === req.params.classID.toString());
//         if (!classObj) {
//             return res.status(404).send("Class not found");
//         }
//         const unit = classObj.units.find(u => u._id.toString() === req.params.unitID.toString());
//         if (!unit) {
//             return res.status(404).send("Unit not found");
//         }
//         const lesson = unit.lessons.find(l => l._id.toString() === req.params.lessonID.toString());
//         if (!lesson) {
//             return res.status(404).send("Lesson not found");
//         }
//         const answerStatusIndex = lesson.answer_status.findIndex(a => a._id.toString() === req.params.questionID.toString());
//         if (answerStatusIndex === -1) {
//             return res.status(404).send("Question not found");
//         }
//         lesson.answer_status.splice(answerStatusIndex, 1);
//         await progress.save();
//         console.log("Answer status deleted successfully");
//         res.send("Answer status deleted successfully");
//     } catch (err) {
//         console.log(err.message);
//         res.status(500).send("Server error");
//     }
// });

// router.delete('/:progressID/subject/:subjectID/class/:classID/unit/:unitID/lesson/:lessonID/answer_status/:questionID', async (req, res) => {
//     try {
//         const progress = await Progress.findById(req.params.progressID);
//         if (!progress) {
//             return res.status(404).send("Progress not found");
//         }
//         const subject = progress.subjects.find(s => s._id.toString() === req.params.subjectID.toString());
//         if (!subject) {
//             return res.status(404).send("Subject not found");
//         }
//         const classObj = subject.classes.find(c => c._id.toString() === req.params.classID.toString());
//         if (!classObj) {
//             return res.status(404).send("Class not found");
//         }
//         const unit = classObj.units.find(u => u._id.toString() === req.params.unitID.toString());
//         if (!unit) {
//             return res.status(404).send("Unit not found");
//         }
//         const lesson = unit.lessons.find(l => l._id.toString() === req.params.lessonID.toString());
//         if (!lesson) {
//             return res.status(404).send("Lesson not found");
//         }
//         const answerStatusIndex = lesson.answer_status.findIndex(a => a._id.toString() === req.params.questionID.toString());
//         if (answerStatusIndex === -1) {
//             return res.status(404).send("Question not found");
//         }
//         lesson.answer_status.splice(answerStatusIndex, 1);
//         await progress.save();
//         console.log("Answer status deleted successfully");
//         const response = "Answer status deleted successfully";
//         console.log(response);
//         res.send(response);
//     } catch (err) {
//         console.log(err.message);
//         res.status(500).send("Server error");
//     }
// });


module.exports = router;
