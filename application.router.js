let express = require("express");
let applicationRouter = express.Router();
const {Application, User} = require('./models');
const jsonParser = express.json();


applicationRouter.post('/', jsonParser, (req, res) => {
     const neededKeys = ["name", "date", "role", "location", "username",
      "interviewExistence", "eventType", "dateOfEvent", "interviewQuestions" ];

      for(let i = 0; i < neededKeys.length; i++) {
      	let key = neededKeys[i];
      	if(!(key in req.body)) {
      		res.send(`Error, ${key} is not in the request body`);
      	}
      }

      User.findOne({username: req.body.username})
      .then(user => {
      	//create a new user with all of the tags defined in the needed keys, then post a serialized version of the item
      	if(user){
      		res.status(200).send("Wow, it actually worked..");
      	}
      	res.status(400).send("please work");	
      })
      .catch(err => {
      	res.status(400).send("Internal Error")
      });




})








module.exports = applicationRouter;