const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const {DATABASE_URL, PORT} = require('./config');
const router = require('./routers/user-router');
const authRouter = require('./routers/auth-router');
const applicationRouter = require('./routers/application.router');
const eventRouter = require('./routers/event-router');




app.use(express.static('public'));
app.use(morgan('common'));
mongoose.Promise = global.Promise;
app.use('/user', router);
app.use('/login', authRouter);
app.use('/applications', applicationRouter);
app.use('/events', eventRouter);



//connects to the database, and starts the server
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

//disconnects from the database and closes the server
function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
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