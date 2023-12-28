const express = require("express")
const router = express.Router();
const UserModel = require("../Models/UserModel")
const passport = require("passport");
const TestModel = require("../Models/TestModel");

router.get("/",async (req,res)=>{
    try {
        res.status(200).send("<h1>This is a successful router<h1>")
    } catch (error) {
        
    }
})

// create new user 

router.post("/",async (req,res)=>{
    try {
        const newUser = await UserModel.create(req.body);
        await newUser.save()
        res.status(201).send({message:`congratulations! You are registerd successfully`, data:newUser})
    } catch (error) {
        res.status(400).send({message:"something went wrong", error})
    }
})

// login 

router.post("/login",passport.authenticate("local"), async (req,res)=>{
    res.status(200).send(req.user)
})




// get all students

router.get("/allStudents", async(req,res)=>{
    try {
        if (!req.user) return res.status(400).send({message:"please authenticate yourself"})
        if (req.user.role === "student") return res.status(400).send({message:"Student cannot see all strudents"})
        const allStudents = await UserModel.find({role:"student"})
        res.status(200).send({message:"here are all the students",data:allStudents})
         
    } catch (error) {
        res.status(400).send({message:"something went wrong!", error})
    }
})

// get student by id

router.get("/getStudent/:id", async(req,res)=>{
    try {
        if (!req.user) return res.status(400).send({message:"please authenticate yourself"})
        if (req.user.role === "student") return res.status(400).send({message:"Student cannot see other strudents"})
        const student = await UserModel.findById(req.params.id)
        res.status(200).send({message:"here is the students",data:student})
    } catch (error) {
        res.status(400).send({message:"something went wrong!", error})
    }
})

// update marks of particular student




module.exports = router