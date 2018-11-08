const mongoose= require("mongoose");
const bcrypt = require('bcryptjs');

mongoose.Promise = global.Promise;


//user schema
const userSchema = mongoose.Schema({
	username: {type: String, required: true, unique: true},
	password: {type: String, required: true}
});

//application schema
const applicationSchema = mongoose.Schema({
	name: {type: String, required: true},
	date: {type: Date, required: true},
	role: {type: String, required: true},
	user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
	location: {type: String, required: true}
});

//meetup schema
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
 	next();
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
  	next();
});


userSchema.methods.serialize = function() {
	return {
    	username: this.username || ''
  	};
};

applicationSchema.methods.serialize = function() {
	return {
		id: this._id,
		name: this.name,
		date: this.date,
		role: this.role,
		location: this.location
	}
}

meetupSchema.methods.serialize = function() {
	return {
		id: this._id,
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


const User = mongoose.model('User', userSchema);
const Application = mongoose.model('Application', applicationSchema);
const Meetup = mongoose.model('Meetup', meetupSchema);

module.exports = {User, Application, Meetup};