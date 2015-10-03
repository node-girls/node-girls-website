var Hapi = require('hapi');

exports.init = function (port, next) {

  var server = new Hapi.Server();
  server.connection({port: port});

  server.start(function (err) {

    return next(err, server);
  });
};