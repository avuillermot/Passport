var sUsers = require("../services/user");
var sPassport = require("../services/passport");
var httpConfig = require("../config/http");


app.put('/authenticate', function(req, res){
	console.log("authenticate !");
	console.log(req.body);
	if (req.body == null || req.body.login === undefined 
		|| req.body.password === undefined) httpConfig.callback2(400, {message: "Utilisateur inconnu"}, res);
	else {
		var context = {
			login: req.body.login,
			password: req.body.password
		};
		sUsers.authenticateV2(context, httpConfig.callback2, res);
	}
});

app.put('/refresh', function(req, res){
	console.log("refresh !");
	console.log(req.body);
	var context = {
		accessId: req.body.access
	};
	sPassport.refreshToken(context, httpConfig.callback2, res);
});

app.put('/check', function(request, response){
	if (request.body.token == null || request.body.token == undefined) 
		httpConfig.callback(401, {}, response);
	else {
		var context = {
			token: request.body.token,
			module: request.body.module
		};
		sPassport.checkToken(context, httpConfig.callback, response);
	}
});
