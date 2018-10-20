const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const {DATABASE_URL, PORT} = require('./config');
const router = require('./user-router');
const authRouter = require('./auth-router');
const applicationRouter = require('./application.router');



app.use(express.static('public'));
app.use(morgan('common'));
mongoose.Promise = global.Promise;
app.use('/user', router);
app.use('/auth', authRouter);
app.use('/applications', applicationRouter)





app.get("/dashboard", (req, res) => {
	console.log(__dirname);
	res.sendFile(`${__dirname}/public/dashboard.html`);
})






function runServer(databaseUrl, port =PORT) {
    return new Promise((resolve, reject) => {
      mongoose.connect(
        databaseUrl,
        err => {
          if(err) {
            return reject(err);
          }
          server = app
            .listen(port, () => {
              console.log(`Your app is listening on port ${port}`);
              resolve();
            })
            .on("error", err => {
              mongoose.disconnect();
              reject(err);
            });
        }
      );
    })
  };


 function closeServer() {
    return mongoose.disconnect().then(() => {
      return new Promise((resolve, reject) => {
        console.log("Closing server");
        server.close(err => {
          if (err) {
            return reject(err);
          }
          resolve();
        });
      });
    });
};

//clever!!! this basically allows for the app to run and use the DATABASE url if and only if the app is run from the server,
//and not from somewhere else
if (require.main === module) {
  runServer(DATABASE_URL).catch(err => console.log(err));
};



module.exports = { app, runServer, closeServer };