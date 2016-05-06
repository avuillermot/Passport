var http = require('http');

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next();
    }
};

var callback = function(code, content, response) {

  // Paramétrage du header
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Content-Type', 'application/json');

  // Si le code est différent de 200, erreur
  if (code != 200 ){
    content = {
      "code": code,
      "status": http.STATUS_CODES[code],
      "info" : content
    };
  }

  if ('object' != typeof content) {
    content = {"result":content};
  }

  response.writeHead(code);
  // On renvoi le résultat
  response.end(JSON.stringify(content));
};

exports.callback = callback;
exports.allowCrossDomain = allowCrossDomain;