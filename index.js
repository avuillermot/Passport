console.log("start");
const path = require('path');
var moment = require('moment');
var url = require("url");
var https = require('https');
var http = require('http');
var fs = require('fs');
var httpConfig = require(path.resolve(__dirname,"config/http"));
var express = require("express");
var bodyParser = require('body-parser');
var q = require('q');

global.app = express();
global.app.use(httpConfig.allowCrossDomain);
global.app.use(bodyParser.urlencoded({ extended: false }));
global.app.use(bodyParser.json())

var sUsers = require(path.resolve(__dirname,"services/user"));
var sPassport = require(path.resolve(__dirname,"services/passport"));


require(path.resolve(__dirname,"api/apiAuthenticate"));
require(path.resolve(__dirname,"api/apiMessageBird"));

var isOver18 = function(birthDate) {
	var limit = new moment();
	limit.add(-18, 'years');

	var birth = new moment(birthDate, "DD/MM/YYYY");
	if (limit.diff(birth) < 0) return false;
	else return true;
};

app.post('/',function(req, res) {
	var context = req.body;
	var major = true;

	if (context.groupe == 'CUSTOMER') major = isOver18(context.birthDate);
	else {
		context.tokenCheckPhone = null;
		context.phoneChecked = false;
	}
	if (context.birthDate != null && context.birthDate != undefined) context.birthDate = new moment(context.birthDate, "DD/MM/YYYY").format("YYYY-MM-DD");

	if (major == false) {
		httpConfig.callback(400,"Vous devez être majeur pour accéder aux services.",res);
		return false;
	}
	// pas d'adresse pour les membres d'une auto ecole
	if (context.place !== undefined) {
		var address = sUsers.convertGoogleAddress(context.place);
		context.fullAddress = address.fullAddress;
		context.address1 = address.address1;
		context.zip = address.zip;
		context.city = address.city;
		context.country = address.country;
	}
	else {
		context.fullAddress = "NO_ADDRESS";
		context.address1 = "NO_ADDRESS";
		context.zip = "NO_ADDRESS";
		context.city = "NO_ADDRESS";
		context.country = "NO_ADDRESS";
	}
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
		var major = true;
		if (info.groupRef == 'CUSTOMER') major = isOver18(context.birthDate);
		if (major == false) {
			httpConfig.callback(400,"Vous devez être majeur pour accéder aux services.",res);
			return false;
		}
		if (context.birthDate != null && context.birthDate.indexOf("/") > -1) 
			context.birthDate = new moment(context.birthDate, "DD/MM/YYYY").format("YYYY-MM-DD");
		var q1 = q.defer();
		q1.promise.then(
			function() {
				if (code == 200) sUsers.update(context, httpConfig.callback, res);
				else httpConfig.callback(400,{message: "Erreur code retour"},res);
			},
			function() {
				httpConfig.callback(400,{message: "Erreur lors de la mise à jour."},res);
			}
		);
		q1.resolve();
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
	if ((req.body == null && req.body != undefined) || req.body.login === undefined 
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
	
	if ((req.body == null && req.body != undefined) || req.body.login === undefined 
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
	if (req.body == null && req.body != undefined)  {
		var context = httpConfig.getAuthorizationContext(req);
		context.password = req.body.password;
		context.oldPassword = req.body.oldPassword;
		var f = function(code, info, res) {
			console.log(code);
			if (code == 200) sUsers.changePassword(context, httpConfig.callback, res);
			else httpConfig.callback(400,{},res);
		};
		sPassport.checkToken(context, f, res);
	}
	else httpConfig.callback(400,{},res);
});

app.get('/:module', function(request, response){
	if (request.body == null && req.body != undefined)  {
		var context = httpConfig.getAuthorizationContext(request);
		var f = function(code, info, response) {
			if (code !== 200) httpConfig.callback(code,[],response);
			else sUsers.get(context, httpConfig.callback, response);
		};
		sPassport.checkToken(context, f, response);
	}
	else httpConfig.callback(400,{},res);
});

app.get('/test', function(request, response){
	console.log("test end");
	response.writeHead(200, {"Content-Type": "text/plain"});
	response.end("Hello World!");
});

var port = process.env.PORT || 1337;
var options = {
};
http.createServer(app).listen(httpConfig.portConfig);
console.log("end");
