exports.register = function (server, options, next) {

  server.route({
    method: 'GET',
    path: '/assets/{params*}',
    config: {
      description: 'load assets',
      handler: {
        directory: {
          path: 'assets'
        }
      }
    }
  });

  return next();
};

exports.register.attributes = {
  name: 'Assets'
};