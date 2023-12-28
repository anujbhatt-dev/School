const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type:String,
    required:true,
    trim:true,
    unique:true,
    
  },
  password: {
    type:String,
    required:true,
    trim:true,
  },
  role: {
    type:String,
    enum:["teacher","student"],
    required:true
  }, // 'teacher' or 'student'
  teaches: {
    type: String,
    enum:["computer","physics","chemistry","maths"],
    required: function () {
      return this.role === 'teacher';
    },
  }
},{
    timestamps:true
});

module.exports = mongoose.model('User', userSchema);
