 //Import express
 const express = require('express')
 //Import mongoose
 const mongoose = require('mongoose')
 require('dotenv').config()

//const url = 'mongodb://127.0.0.1/AlienDBex'
//  const url = 'mongodb://127.0.0.1/User'
//Initialize the app
 const app = express()

const morgan = require('morgan');
const bodyParser= require('body-parser');

 mongoose.set('strictQuery', true);

 mongoose.connect('mongodb+srv://maryammmt:'+
     process.env.MONGO_ATLAS_PW+
     '@webdev.agtsif4.mongodb.net/?retryWrites=true&w=majority'
     ,
     {
         //useMongoClient:true
         useNewUrlParser: true
     }
 );

 const con = mongoose.connection

 con.on('open', () =>{
    console.log('MongoDB Atlas is connected! :)')
 })

 app.use(express.json())

 //new
 app.use(morgan('dev'));
 app.use(bodyParser.urlencoded({extended: false}));
 app.use(bodyParser.json());
 
 const cors = require("cors");
 app.use(cors());
 /*app.use((req, res, next) =>{
     res.header("Access-Control-Allow-Origin","*");
     res.header(
         "Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization"
     );
     if (req.method==='OPTIONS'){
         res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
         return res.status(200).json({});
     }
     next();
 });*/
//end


 /*const alienRouter=require('./routes/aliens')
 app.use('/aliens',alienRouter)*/

 const userRouter=require('./routes/users')
 app.use('/user',userRouter)
 
 //Using Subject Routes
 const subjectRouter=require('./routes/subject-routes')
 app.use('/subject',subjectRouter)
 //Using Class Routes
 const classRouter=require('./routes/class-routes')
 app.use('/class',classRouter)
 //Using Unit Routes
 const unitRouter=require('./routes/unit-routes')
 app.use('/unit',unitRouter)
 //Using Lesson Routes
 const lessonRouter=require('./routes/lesson-routes')
 app.use('/lesson',lessonRouter)
 //Using Question Routes
 const questionRouter=require('./routes/question-routes')
 app.use('/question',questionRouter)
 //Using Leaderboard Routes
 const leaderboardRouter=require('./routes/leaderboard-routes')
 app.use('/leaderboard',leaderboardRouter)

 //Using Student Routes
 const studentRouter=require('./routes/student-routes')
 app.use('/student',studentRouter)

 //Using Progress Routes
 const progressRouter=require('./routes/progress-routes')
 app.use('/progress',progressRouter)

 //Using Role Routes
 const roleRouter=require('./routes/role-routes')
 app.use('/role',roleRouter)

 //Using Admin Routes
 const adminRouter=require('./routes/admin-routes')
 app.use('/admin',adminRouter)


 app.listen(3000, () =>{
    console.log('Server started! :)')
 })


 
 