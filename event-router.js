let express = require("express");
let eventRouter = express.Router();
const {Meetup, User, Application} = require('./models');
const jsonParser = express.json();


eventRouter.post('/', jsonParser, (req, res) => {
     const neededKeys = ["name", "location", "username", "eventType", "dateOfEvent"];

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
      	Meetup.findOne({user: _user._id, name: req.body.name})
      	.then(app => {
      		if(!app) {
      			const newApp = {name: req.body.name, location: req.body.location, user: userId, eventType: req.body.eventType, 
      				dateOfEvent: req.body.dateOfEvent
      			}
      			Meetup.create(newApp)
      			.then(function(app){
      				res.status(201).json(app.serialize());
      			})
      		}
      		else {
      		res.status(400).send("Event has already been created");
      		}	
      	})
        .catch(err => {
          res.status(500).send("Internal Server Error");
        })
      })
      .catch(err => {
      	res.status(500).send("User cannot be found")
      });
   });

eventRouter.get('/:username', (req, res) => {
    const requiredKey = "username";

    if(!(requiredKey in req.params)) {
      res.status(401).send("Error: Username not included in the request parameter");
    };

    User.findOne({username: req.params.username})
    .then(_user => {
      Meetup.find({user: _user._id}).sort({date: 'desc'}).limit(5)
      .then(applications => {         
            res.status(200).json(applications.map(application => application.serialize()))
      });
    })
    .catch(err => {
      res.status(400).send("No user or application found");
    })
})


eventRouter.get('/:username/:sort', (req, res) => {
    const requiredKey = "username";
    const requiredKey2 = "sort";

    if(!(requiredKey in req.params || requiredKey2 in req.params)) {
      res.status(401).send("Error: Username not included in the request parameter");
    };

    User.findOne({username: req.params.username})
    .then(_user => {
      Meetup.find({user: _user._id})
      .then(meetups => {
        let _meetups;
         
            if(req.params.sort === "name") {
              _meetups = meetups.sort(function(a, b){
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
              _meetups = meetups.sort(function(a, b){
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
              _meetups = meetups.sort(function(a, b){
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
            res.status(201).json(_meetups.map(meetup => meetup.serialize()))
      });
    })
    .catch(err => {
      res.status(400).send("No user or meetup found");
    })
})


eventRouter.delete('/', jsonParser, (req, res) => {
     neededKeys = ["name", "username"];
     for(let i = 0; i < neededKeys.length; i++) {
      if(!(neededKeys[i] in req.body)) {
        res.status(400).send(`${neededKeys[i]} not found in request body`); 
      }
     } 


     User.findOne({username: req.body.username})
     .then(_user => {
        Meetup.findOneAndDelete({user: _user._id, name: req.body.name})
        .then(function() {
          res.status(204).send(`${req.body.name} meetup deleted`);
        })
        .catch(err => {
          res.status(500).send("Internal Server Error");
        })
     })
     .catch(err => {
      res.status(400).send("User does not exist");
     });
})


      	
   








module.exports = eventRouter;