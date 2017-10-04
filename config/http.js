var http = require('http');

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.sendStatus(200);
    }
    else {
      next();
    }
};

var callback = function(code, info, response) {

  // Paramétrage du header
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Content-Type', 'application/json');

  content = {
      "code": code,
      "status": http.STATUS_CODES[code],
      "info" : info
  };

  response.writeHead(code);
  // On renvoi le résultat
  response.end(JSON.stringify(content));
};

var callback2 = function(code, info, response) {

  // Paramétrage du header
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Content-Type', 'application/json');

  response.writeHead(code);
  // On renvoi le résultat
  response.end(JSON.stringify(info));
};

exports.callbackRedirect = function(response, url) {
   response.writeHead(302, {
      'Location': url
    });
   response.end();
};

exports.getAuthorizationContext = function(req) {
  var context = {
    token: req.headers['authorization'],
    module: req.params.module
  };
  return context;
};
exports.callback = callback;
exports.callback2 = callback2;
exports.allowCrossDomain = allowCrossDomain;
exports.portConfig = 8082;