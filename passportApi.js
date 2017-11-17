/*var moment = require('moment');
var exec = require("child_process").exec;
var url = require("url");
var https = require('https');*/
var http = require('http');
/*var fs = require('fs');
var httpConfig = require("./config/http");
var express = require("express");
var bodyParser = require('body-parser');
var q = require('q');

var sUsers = require("./services/user");
var sPassport = require("./services/passport");


require("./api/apiAuthenticate");
require("./api/apiMessageBird");*/

var server = http.createServer(function(request, response) {

    response.writeHead(200, {"Content-Type": "text/plain"});
    response.end("Hello World5555!");

});

var port = process.env.PORT || 1337;
server.listen(port);

