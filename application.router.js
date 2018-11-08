let express = require("express");
let applicationRouter = express.Router();
const {Application, User} = require('./models');
const jsonParser = express.json();

//Validates then creates a new application for a given user
applicationRouter.post('/', jsonParser, (req, res) => {
     const neededKeys = ["name", "date", "role", "location", "username"];

      for(let i = 0; i < neededKeys.length; i++) {
      	let key = neededKeys[i];
      	if(!(key in req.body)) {
      		res.send(`Error, ${key} is not in the request body`);
      	}
      }

      let userId;

      User.findOne({username: req.body.username})
      .then(_user => {
      	userId = _user._id;
      	Application.findOne({user: _user._id, name: req.body.name})
      	.then(app => {
      		if(!app) {
      			const newApp = {name: req.body.name, date: req.body.date, role: req.body.role, location: req.body.location,
      				user: userId
      			}
      			Application.create(newApp)
      			.then(function(app){
      				res.status(201).json(app.serialize());
      			})
      		}
      		else {
      		res.status(400).send("You have already applied to this company, please try another company");
      		}	
      	})
        .catch(err => {
          res.status(500).send("Internal Server Error");
        })
      })
      .catch(err => {
      	res.status(400).send("User cannot be found")
      });
   });

//After validation, returns the last 5 applications created for a given user
applicationRouter.get('/:username', (req, res) => {
    const requiredKey = "username";

    if(!(requiredKey in req.params)) {
      res.status(401).send("Error: Username not included in the request parameter");
    };

    User.findOne({username: req.params.username})
    .then(_user => {
      Application.find({user: _user._id}).sort({date: 'desc'}).limit(5)
      .then(applications => {        
            res.status(200).json(applications.map(application => application.serialize()))
      });
    })
    .catch(err => {
      res.status(400).send("No user or application found");
    })
})

//After validation returns all applications created by a given user sorted using the sort defined in the params
applicationRouter.get('/:username/:sort', (req, res) => {
    const requiredKey = "username";
    const requiredKey2 = "sort";

    if(!(requiredKey in req.params  || requiredKey2 in req.params)) {
      res.status(401).send("Error: Username not included in the request parameter");
    };

    User.findOne({username: req.params.username})
    .then(_user => {
      Application.find({user: _user._id})
      .then(applications => {
          let _applications;
         

            if(req.params.sort === "date") {
              _applications = applications.sort(function(a, b){
                  if (a.date > b.date) {
                    return 1;
                  }
                  else if (a.date < b.date) {
                    return -1;
                  } 
                  else if (a.date === b.date) {
                    return 0;
                  }
              });
            }

            res.status(201).json(_applications.map(application => application.serialize()))
            //res.status(200).json(applications.map(application => {
                  //application.serialize();
      });
    })
    .catch(err => {
      res.status(400).send("No user or application found");
    })
})

//Deletes a application based on the username and name of application provided
applicationRouter.delete('/', jsonParser, (req, res) => {
     neededKeys = ["name", "username"];
     for(let i = 0; i < neededKeys.length; i++) {
      if(!(neededKeys[i] in req.body)) {
        return res.status(400).send(`${neededKeys[i]} not found in request body`); 
      }
     } 


     User.findOne({username: req.body.username})
     .then(_user => {
        Application.findOneAndDelete({user: _user._id, name: req.body.name})
        .then(function() {
          res.status(204).send("Deleted data");
        })
        .catch(err => {
          res.status(500).send("Internal Server Error");
        })
     })
     .catch(err => {
      res.status(400).send("User does not exist");
     });
})

applicationRouter.put('/', jsonParser, (req, res) => {
     neededKeys = ["name", "username"];
     for(let i = 0; i < neededKeys.length; i++) {
      if(!(neededKeys[i] in req.body)) {
        res.status(400).send(`${neededKeys[i]} not found in request body`); 
      }
     } 

     User.findOne({username: req.body.username})
     .then(_user => {
      Application.findOneAndUpdate({user: _user._id, name: req.body.name}, {interviewExistence: true})
      .then(application => {
        res.status(200).send(application.serialize());
      })
      .catch(err => {
        res.status(400).send("Application does not exist")
      })
     })
     .catch(err => {
      res.status(500).send("User does not exist");
     })
})
      	
   








module.exports = applicationRouter;