require('env2')('.env');
console.log(process.env.PORT);
var Server = require('./index.js');
var Hoek = require('hoek');

Server.init(process.env.PORT, function (err, server) {

  Hoek.assert(!err, err);
  console.log('The server is running on: ', server.info.uri);
});