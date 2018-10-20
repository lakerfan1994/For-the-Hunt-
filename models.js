const mongoose= require("mongoose");
const bcrypt = require('bcryptjs');

mongoose.Promise = global.Promise;



const userSchema = mongoose.Schema({
 	username: {type: String, required: true, unique: true},
 	password: {type: String, required: true},
 });

const applicationSchema = mongoose.Schema({
	name: {type: String, required: true, unique: true},
	date: {type: Date, required: true},
	role: {type: String, required: true},
	user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false},
	location: {type: String, required: true},
	interviewExistence: {type: Boolean, required: true},
	eventType: {type: String, required: true},
	dateOfEvent: {type: Date, required: true},
	interviewQuestions: {type: String, required: false}
});

const meetupSchema = mongoose.Schema({
	name: {type: String, required: true},
	user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
	dateOfEvent: {type: Date, required: true},
	location: {type: String, required: true},
	eventType:{type: String, required: true}
});

applicationSchema.pre('find', function(next){
  this.populate('user');
  next();
});

 applicationSchema.pre('findOne', function(next){
  this.populate('user');
  next();
});

 applicationSchema.pre('save', function(next){
  this.populate('user');
});

 meetupSchema.pre('find', function(next){
  this.populate('user');
  next();
});

 meetupSchema.pre('findOne', function(next){
  this.populate('user');
  next();
});

 meetupSchema.pre('save', function(next){
  this.populate('user');
});


userSchema.methods.serialize = function() {
  return {
    username: this.username || ''
  };
};

applicationSchema.methods.serialize = function() {
	return {
		name: this.name,
		date: this.date,
		role: this.role,
		location: this.location,
		interviewExistence: this.interviewExistence,
		eventType: this.eventType,
		dateOfEvent: this.dateOfEvent,
		interviewQuestions: this.interviewQuestions
	}
}

meetupSchema.methods.serialize = function() {
	return {
		name: this.name,
		dateOfEvent: this.dateOfEvent,
		location: this.location,
		eventType: this.eventType
	}
}


userSchema.methods.validatePassword = function(password) {
  return bcrypt.compare(password, this.password);
};

userSchema.statics.hashPassword = function(password) {
  return bcrypt.hash(password, 10);
};




//applications: [{name: String,  role: String, date: Date, location: String, interviewExistence: Boolean, eventType: String,
 	// dateOfEvent: Date, interviewQuestions: String}],
 //	meetups:[{name: String, dateOfEvent: Date, location: String, eventType: String}]


const User = mongoose.model('User', userSchema);
const Application = mongoose.model('Application', applicationSchema);
const Meetup = mongoose.model('Meetup', meetupSchema);

module.exports = {User, Application, Meetup};