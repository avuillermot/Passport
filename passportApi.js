var exec = require("child_process").exec;
var url = require("url");
var httpConfig = require("./config/http");
var express = require("express");
var bodyParser = require('body-parser');

var sUsers = require("./services/users");
var sPassport = require("./services/passport");

var app = express();
app.use(httpConfig.allowCrossDomain);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

app.put('/authenticate', function(req, res){
	try {
		console.log(req.body);
		var context = {
			login: req.body.login,
			password: req.body.password
		};
		sUsers.authenticate(context, httpConfig.callback, res);
	}
	catch(ex) {
		httpConfig.callback(400,[],res);
	}
});

app.put('/checkToken', function(request, response){
	console.log(request.body);
	var context = {
		token: request.body.tokenId,
		module: request.body.module
	};
	sPassport.checkToken(context, httpConfig.callback, response);
});

//********************************
// run http server
//********************************	
app.listen(8082);


// Console will print the message
console.log('Server running at http://127.0.0.1:8082/');