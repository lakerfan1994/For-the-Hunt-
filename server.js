const express = require('express');
const app = express();
const morgan = require('morgan')

app.use(express.static('public'));
app.use(morgan('common'));





app.get("/dashboard", (req, res) => {
	console.log(__dirname);
	res.sendFile(`${__dirname}/public/dashboard.html`);
})


















let server;


function runServer() {
  const port = process.env.PORT || 8080;
  return new Promise((resolve, reject) => {
    server = app
      .listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve(server);
      })
      .on("error", err => {
        reject(err);
      });
  });
}

function closeServer() {
  return new Promise((resolve, reject) => {
    console.log("Closing server");
    server.close(err => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
}


if (require.main === module) {
  runServer().catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };