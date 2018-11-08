const chai = require('chai');
const chaiHttp = require('chai-http');
const { app, runServer, closeServer } = require("../server");
const {User, Application, Meetup} = require('../models')
const {TEST_DATABASE_URL} = require('../config');
const faker = require('faker');
const mongoose = require('mongoose');
const expect = chai.expect;
chai.use(chaiHttp);



function tearDownDb() {
  console.warn('Deleting database');
  return mongoose.connection.dropDatabase();
}





describe('Initial tests', function() {

  let user = {"username": "JohnSmith", "password": "1234567890"};
  let googleApp ={"name": "Google", "date": new Date(), "role": "Senior Developer", "location": "New York","username": "JohnSmith"}
  let eventApp = {"name": "Javafunscript", "location": "New York", "username": "JohnSmith", "eventType": "Meetup", "dateOfEvent": new Date()}
  let deleteableApp = {"name": "Google", "username": "JohnSmith"};
  let deleteableEvent = {"name": "Javafunscript", "username": "JohnSmith"};
  before(function(){
    return runServer(TEST_DATABASE_URL);
  });



  after(function(){
  	tearDownDb();
    return closeServer;
  });

	it('should serve static html files and return a 200 status code upon server start', function() {
			return chai.request(app).get('/').then(function(res) {
				expect(res).to.have.status(200);
				expect(res).to.be.html;	
		});		
	})

	describe('User initialization', function() {

		it('should create a new user if acceptable inputs are sent to the endpoint', function(){
			let user = {"username": "JohnSmith", "password": "1234567890"};


			return chai.request(app)
			.post('/user')
			.send(user)
			.then(function(res) {
				expect(res).to.have.status(201);
				expect(res).to.be.json;
				expect(res.body.username === "JohnSmith").to.be.true;
				expect(res.body.password === "1234567890").to.be.false;
			});


		})

		it('should return a 422 status message if the same user is created twice twice', function() {
		
			return chai.request(app)
			.post('/user')
			.send(user)
			.then(function(res) {
				expect(res).to.have.status(422);
				expect(res).to.be.json;
			});

		})



		//it('should return a 400 status message if one of username or password is not in the request body', function() {
		//	let user = {"username": "JohnSmith1"};
		//	let user2 = {}

		//})

		describe('Authorization to login user', function(){

		it('should return 201 status and a authToken that would be used for user authentication upon successfuly requesting username and password ', function() {
			return chai.request(app)
			.post('/login')
			.send(user)
			.then(function(res) {
				expect(res.body).to.include.keys('authToken');
				expect(res).to.be.json;
				expect(res).to.have.status(201);
			})
		})

		it('should return 400 status if user enters either a incorrect password', function() {

			let _user = user;
			_user.password = "8282828282";
			return chai.request(app)
			.post('/login')
			.send(_user)
			.then(function(res) {
				expect(res).to.have.status(400);



			})
		})	
			
		})


		describe('POST requests to both applications and meetups', function() {

			it('should return a 200 status for the newly created app', function() {
				return chai.request(app)
				.post('/applications')
				.send(googleApp)
				.then(function(res) {
					expect(res).to.have.status(200);
				})
			})

			it('should return 200 status for the newly created event', function(){
				return chai.request(app)
				.post('/events')
				.send(eventApp)
				.then(function(res) {
					expect(res).to.have.status(201);
				})
			})


		})



		describe('GET requests to both applications and meetups', function() {

			it('should send back data representing all applications currently linked to the given user', function() {
				return chai.request(app)
				.get('/applications/JohnSmith/date')
				.then(function(res) {
					expect(res).to.have.status(201);
					expect(res).to.be.json;
					return chai.request(app)
					.get('/applications/JohnSmith')
					.then(function(_res) {
						expect(_res).to.have.status(200);
						expect(_res).to.be.json;
					})
				});

					
			})

			it('should send back data representing all events currently linked to the given user', function() {
				return chai.request(app)
				.get('/events/JohnSmith/date')
				.then(function(res) {
					expect(res).to.have.status(201);
					expect(res).to.be.json;
					return chai.request(app)
					.get('/events/JohnSmith')
					.then(function(_res) {
						expect(_res).to.have.status(200);
						expect(_res).to.be.json;
					})
				});
			})
		})

	describe('DELETE requests to both applications and meetups', function() {
		it('should delete application data and event data and send back a 204 status message for both', function() {
			return chai.request(app)
			.delete('/applications')
			.send(deleteableApp)
			.then(function(res) {
				expect(res).to.have.status(204);
				return chai.request(app)
				.delete('/events')
				.send(deleteableEvent)
				.then(function(res) {
					expect(res).to.have.status(204);
				})
			})		
		})
	})
	})

});