const express = require("express")
const router = express.Router();
const mongoose = require("mongoose")
const UserModel = require("../Models/UserModel")
// const passport = require("passport");
const TestModel = require("../Models/TestModel");


// create new test 

router.post("/addTest", async (req,res)=>{
    try {
        if (!req.user) return res.status(400).send({message:"please authenticate yourself"})
        if (req.user.role === "student") return res.status(400).send({message:"Student cannot create new test "})
        req.body.subject = req.user.teaches
        const newTest = await TestModel.create(req.body)
        newTest.creator = req.user.id
        await newTest.save();
        res.status(201).send({message:"test created successfully", data:newTest})
    } catch (error) {
        res.status(400).send({message:"something went wrong!",error})
    }
})


// update scorese

router.patch('/updateScores/:testId', async (req, res) => {
    const { testId } = req.params;
    const { studentId, score } = req.body;
    if (!req.user) return res.status(400).send({message:"please authenticate yourself"})
    if (req.user.role === "student") return res.status(400).send({message:"Student cannot update test "})
  
    try {
      const test = await TestModel.findById(testId);
      if (!test) return res.status(404).send({message:'Test not found' });
      const student = await UserModel.findById(studentId);
      if (!student || student.role !== 'student') return res.status(404).send({ message: 'Student not found' })
      const existingScoreIndex = test.scores.findIndex(s => s.student.toString() === studentId);
      if (existingScoreIndex !== -1) {
        test.scores[existingScoreIndex].score = score;
      } else {
        test.scores.push({ student: studentId, score });
      }
      await test.save();
  
      res.status(202).send({ message: 'Scores updated successfully',data:test });
    } catch (error) {
      res.status(400).send({ message:"something went wrong",error });
    }
  });

// calculate top two scorer

router.get("/topScorers/:testId", async(req,res)=>{
    const objectIdTestId = new mongoose.Types.ObjectId(req.params.testId);
    console.log(objectIdTestId);
    try {
        const topScorers = await TestModel.aggregate([
            {
                $match: { _id : objectIdTestId }
            },
            { $unwind: '$scores' }, 
            { $sort: { 'scores.score': -1 } }, 
            { $limit: 2 }, 
                {
                  $group: {
                    _id: '$_id',
                    subject: { $first: '$subject' }, 
                    duration: { $first: '$duration' },
                    scores: { $push: '$scores' }, 
                  },
                }  
          ])

        res.status(200).send(topScorers)
    } catch (error) {
        res.status(400).send(error)
    }
})

// calculate topper 

router.get('/overallTopper', async (req, res) => {
    try {
      
      const averageScores = await TestModel.aggregate([
        { $unwind: '$scores' }, 
        {
          $group: {
            _id: '$scores.student',
            average: { $avg: '$scores.score' }, 
          },
        },
        { $sort: { average: -1 } }, 
        { $limit: 1 }, 
      ]);
  
      
      const topScorerDetails = await UserModel.findById(averageScores[0]._id);
  
      res.status(200).send({ message: 'Overall topper retrieved successfully', data: topScorerDetails });
    } catch (error) {
      console.error(error);
      res.status(400).send({ error });
    }
  });


module.exports = router