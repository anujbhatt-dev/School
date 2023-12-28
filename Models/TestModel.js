const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true,
    unique:true,
    enum:["computer","physics","chemistry","maths"],
  },
  duration: {
    type: Number, // Duration in minutes
    required: true,
  },
  creator:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
  },
  scores: [{
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    score: {
      type: Number,
      min: 0,
    },
  }],
}, {
  timestamps: true,
});

module.exports = mongoose.model('Test', testSchema);
