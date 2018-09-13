const chai = require('chai');
const chaiHttp = require('chai-http');
const { app, runServer, closeServer } = require("../server");
const faker = require('faker');
const mongoose = require('mongoose');

const expect = chai.expect;


chai.use(chaiHttp);


describe('Initial tests', function() {

  before(function(){
    return runServer;
  });

  after(function(){
    return closeServer;
  });

	it('should serve static html files and return a 200 status code upon server start', function() {
			return chai.request(app).get('/').then(function(res) {
				expect(res).to.have.status(200);
				expect(res).to.be.html;	
		});		
	})


	it('should serve dashboard html file and return a status code upon server start', function() {
		return chai.request(app).get('/dashboard').then(function(res) {
				expect(res).to.have.status(200);
				expect(res).to.be.html;	
		});		

	})

});