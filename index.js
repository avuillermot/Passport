const path = require('path');

var moment = require('moment');
//var exec = require("child_process").exec;
var url = require("url");
var https = require('https');
var http = require('http');
var fs = require('fs');
var httpConfig = require(path.resolve(__dirname,"config/http"));
var express = require("express");
var bodyParser = require('body-parser');
var q = require('q');

var sUsers = require(path.resolve(__dirname,"services/user"));
var sPassport = require(path.resolve(__dirname,"services/passport"));


/*require(path.resolve(__dirname,"api/apiAuthenticate"));
require(path.resolve(__dirname,"api/apiMessageBird"));*/

var server = http.createServer(function(request, response) {

    response.writeHead(200, {"Content-Type": "text/plain"});
    response.end("Hello World5555222!");

});

var port = process.env.PORT || 1337;
server.listen(port);

