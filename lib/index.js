require('env2')('.env');
var Assets = require('./assets.js');
var Hapi = require('hapi');
var Home = require('./home.js');
var Handlebars = require('handlebars');
var Inert = require('inert'); //Static file and directory handlers plugin for hapi.js
var Vision = require('vision'); //Templates rendering support for hapi.js 

exports.init = function (port, next) {

  var server = new Hapi.Server();
  server.connection({port: port});

  server.register([Inert, Vision, Assets, Home], function (err) {

    if (err) {
      return next(err);
    }

    server.views({
      engines: {
        html: Handlebars
      },
      relativeTo: __dirname + '/../views/',
      path: '.',
      layout: 'default',
      layoutPath: 'layout',
      helpersPath: 'helpers',
      partialsPath: 'partials'
    });
 

    server.start(function (err) {

      return next(err, server);
    });
  });
};