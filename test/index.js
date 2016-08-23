require('env2')('.env');
var Code = require('code');
var Hapi = require('hapi');
var Lab = require('lab');
var Server = require('../lib');
var Home = require('../lib/home.js');

// Test shortcuts
var lab = exports.lab = Lab.script();
var expect = Code.expect;
var it = lab.test;

it('starts server and returns hapi server object', function (done) {

  Server.init(0, function (err, server) {

    expect(err).to.not.exist();
    expect(server).to.be.instanceof(Hapi.Server);

    server.stop(done);
  });
});

// it('starts server on provided port', function (done) {

//   Server.init(Number(process.env.PORT), function (err, server) {

//     expect(err).to.not.exist();
//     expect(server.info.port).to.equal(Number(process.env.PORT));

//     server.stop(done);
//   });
// });

it('handles register plugin error', { parallel: false }, function (done) {

  Home.register = function (server, options, next) {

    return next(new Error('failed plugin'));
  };

  Home.register.attributes = {
    
    name: 'fake plugin'
  };

  Server.init(0, function (err, server) {

    expect(err).to.exist();
    expect(err.message).to.equal('failed plugin');

    done();
  });
});