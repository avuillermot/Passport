var Promise = require('promise')
var pool = require("../config/connexion");
var TYPES = require('tedious').TYPES;

exports.authenticate = function(context, callback, response) {
	var that = this;
	var user = [];

	var failed1 = function(dataset, err) { console.log("fail-1"); console.log(err); callback(400, [], response);};
	
	var p1CheckPassword = function(dataset, err) {
		if (dataset[0].password == context.password) {
			that.user = dataset[0];
			console.log("user valid : " + that.user.id);
			var params2 = [];
			params2.push({name: "userId" , type: TYPES.VarChar, value: that.user.id});
			params2.push({name: "applicationId" , type: TYPES.VarChar, value: "48DD366E-C25E-4399-960A-F01D04C70002"});
			var p2 = new Promise(function(resolve, reject) { pool.callProcedure("CreateAccess", params2, p2CreateAccess, failed1)});
		}
		else callback(400, [], response);
	};
	
	var p2CreateAccess = function(access) {
		console.log("create access/token to user : " + that.user.id);
		delete that.user.password;
		that.user.accessId = access[0].accessId;
		that.user.tokenId = access[0].tokenId;
				
		callback(200, that.user, response);		
	};
		
	var params1 = [];
	params1.push({name: "login" , type: TYPES.VarChar, value: context.login});
	var p1 = new Promise(function(resolve, reject) { pool.callProcedure("GetUserByLogin", params1, p1CheckPassword, failed1)});
	
	p1.then(p1CheckPassword).then(p2CreateAccess).catch(failed1);
}