var exec = require("child_process").exec;
var url = require("url");
var httpConfig = require("./config/http");
var express = require("express");
var bodyParser = require('body-parser');
var q = require('q');

var sUsers = require("./services/user");
var sPassport = require("./services/passport");
var sPayment = require("./services/paiement");

var app = express();
app.use(httpConfig.allowCrossDomain);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

app.post('/',function(req, res) {
	var context = req.body;
	var address = sUsers.convertGoogleAddress(context.place);
	context.fullAddress = address.fullAddress;
	context.address1 = address.address1;
	context.zip = address.zip;
	context.city = address.city;
	context.country = address.country;
	if (req.body.login == null) context.login = req.body.email;
	sUsers.create(context, httpConfig.callback, res);
});

app.put('/:module',function(req, res) {
	var context = httpConfig.getAuthorizationContext(req);
	for (var prop in req.body) {
		context[prop] = req.body[prop];
	}
	if (context.place != null) {
		var address = sUsers.convertGoogleAddress(context.place);
		context.fullAddress = address.fullAddress;
		context.address1 = address.address1;
		context.zip = address.zip;
		context.city = address.city;
		context.country = address.country;
	};

	var f = function(code, info, res) {
		var q1 = q.defer();
		q1.promise.then(
			function() {
				console.log(arguments);
				if (code == 200) sUsers.update(context, httpConfig.callback, res);
				else httpConfig.callback(400,{},res);
			},
			function() {
				console.log(arguments);
				if (code == 200) sUsers.update(context, httpConfig.callback, res);
				else httpConfig.callback(400,{},res);
			}
		);
		sPayment.updateUser(q1,context);
	};

	sPassport.checkToken(context, f, res);
});

app.put('/generate/password', function(req, res) {
	var context = req.body;
	sUsers.generatePassword(context, httpConfig.callback, res);
});

//***************************************************
// authentification sans notion de group
//***************************************************
app.put('/authenticate/mobile', function(req, res){
	console.log("authenticate mobile");
	console.log("login:" + req.body.login);
	console.log("password:" + req.body.password);
	
	if (req.body == null || req.body.login === undefined 
		|| req.body.password === undefined) httpConfig.callback(400, {message: "Utilisateur inconnu"}, res);
	else {
		var context = {
			login: req.body.login,
			password: req.body.password
		};
		sUsers.authenticateV2(context, httpConfig.callback, res);
	}
});

app.put('/authenticate/customer', function(req, res){
	console.log("authenticate customer");
	console.log("login:" + req.body.login);
	console.log("password:" + req.body.password);
	
	if (req.body == null || req.body.login === undefined 
		|| req.body.password === undefined || req.body.group === undefined) httpConfig.callback(400, {message: "Utilisateur inconnu"}, res);
	else {
		var context = {
			login: req.body.login,
			password: req.body.password,
			group1: "CUSTOMER"
		};
		sUsers.authenticate(context, httpConfig.callback, res);
	}
});

app.put('/authenticate/driver', function(req, res){
	console.log("authenticate driver");
	console.log("login:" + req.body.login);
	console.log("password:" + req.body.password);
	
	if (req.body == null || req.body.login === undefined 
		|| req.body.password === undefined || req.body.group === undefined) httpConfig.callback(400, {message: "Utilisateur inconnu"}, res);
	else {
		var context = {
			login: req.body.login,
			password: req.body.password,
			group1: "SCHOOL-ADMIN",
			group2: "MONITOR"
		};
		sUsers.authenticate(context, httpConfig.callback, res);
	}
});

app.put('/:module/password', function(req, res){
	var context = httpConfig.getAuthorizationContext(req);
	context.password = req.body.password;
	context.oldPassword = req.body.oldPassword;
	var f = function(code, info, res) {
		console.log(code);
		if (code == 200) sUsers.changePassword(context, httpConfig.callback, res);
		else httpConfig.callback(400,{},res);
	};
	sPassport.checkToken(context, f, res);
});

app.put('/check/token', function(request, response){
	var context = {
		token: request.body.token,
		module: request.body.module
	};
	sPassport.checkToken(context, httpConfig.callback, response);
});

app.put('/refresh/token', function(request, response){
	var context = {
		accessId: request.body.accessId
	};
	sPassport.refreshToken(context, httpConfig.callback, response);
});

// oboslete -> remplacé par app.get('/:module');
app.get('/:token/:module', function(request, response){
	var f = function(code, info, response) {
		if (code !== 200) httpConfig.callback(code,[],response);
		else sUsers.get(request.params, httpConfig.callback, response);
	};

	sPassport.checkToken(request.params, f, response);
});

app.get('/:module', function(request, response){
	var context = httpConfig.getAuthorizationContext(request);
	var f = function(code, info, response) {
		if (code !== 200) httpConfig.callback(code,[],response);
		else sUsers.get(context, httpConfig.callback, response);
	};
	console.log(context);
	sPassport.checkToken(context, f, response);
});

//********************************
// run http server
//********************************	
app.listen(httpConfig.portConfig);


// Console will print the message
console.log('Server running at http://127.0.0.1:8082/');