let express = require("express");
let applicationRouter = express.Router();
const {Application, User} = require('./models');
const jsonParser = express.json();


applicationRouter.post('/', jsonParser, (req, res) => {
     const neededKeys = ["name", "date", "role", "location", "username",
      "interviewExistence", "eventType"];

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
      				user: userId, interviewExistence: req.body.interviewExistence, eventType: req.body.eventType
      			}
      			Application.create(newApp)
      			.then(function(app){
              console.log("are you sure");
      				res.status(201).json(app.serialize());
      			})
      		}
      		else {
      		res.status(400).send("You have already applied to this company");
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
         
            if(req.params.sort === "name") {
              _applications = applications.sort(function(a, b){
                  if (a.name > b.name) {
                    return 1;
                  }
                  else if (a.name < b.name) {
                    return -1;  
                  } 
                  else if (a.name === b.name) {
                    return 0;
                  }
              });
            } 

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

            if(req.params.sort === "role") {
              _applications = applications.sort(function(a, b){
                  if (a.role > b.role) {
                    return 1;
                  }
                  else if (a.role < b.role) {
                    return -1;
                  } 
                  else if (a.role === b.role) {
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