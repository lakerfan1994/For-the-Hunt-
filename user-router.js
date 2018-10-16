let express = require("express");
let router = express.Router();
const {User} = require('./models');
const jsonParser = express.json();