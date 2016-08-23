var Code = require('code');
var Hapi = require('hapi');
var Lab = require('lab');
var Server = require('../lib');

// Test shortcuts
var lab = exports.lab = Lab.script();
var describe = lab.experiment;
var expect = Code.expect;
var it = lab.test;

describe('/', function () {

  it('returns home page with status code 200', function (done) {

    Server.init(0, function (err, server) {

      expect(err).to.not.exist();

      var request = { method: 'GET', url: '/' };
      server.inject(request, function (res) {

        expect(res.statusCode, 'Status code').to.equal(200);

        server.stop(done);
      });
    });
  });
});