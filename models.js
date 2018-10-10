const mongoose= require("mongoose");

const userSchema = mongoose.Schema({
 	username: {type: String, required: true},
 	password: {type: String, required: true},
 	application: [{name: String,  role: String, date: Date, interview: Boolean, interviewDate: Date}]
 });