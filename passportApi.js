var exec = require("child_process").exec;
var url = require("url");
var httpConfig = require("./config/http");
var express = require("express");
var bodyParser = require('body-parser');

var sUsers = require("./services/user");
var sPassport = require("./services/passport");

var app = express();
app.use(httpConfig.allowCrossDomain);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

app.post('/',function(req, res) {
	var context = req.body;
	if (req.body.login == null) context.login = req.body.email;
	sUsers.create(context, httpConfig.callback, res);
});

app.put('/authenticate', function(req, res){
	console.log(req.body.login);
	if (req.body == null || req.body.login === undefined || req.body.password === undefined) httpConfig.callback(400, {message: "Utilisateur inconnue"}, res);
	else {
		var context = {
			login: req.body.login,
			password: req.body.password
		};
		sUsers.authenticate(context, httpConfig.callback, res);
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
app.listen(httpConfig.portConfig);


// Console will print the message
console.log('Server running at http://127.0.0.1:8082/');