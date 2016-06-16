var Promise = require('promise')
var pool = require("../config/connexion");
var TYPES = require('tedious').TYPES;
var crypto = require('../services/crypto');

exports.authenticate = function(context, callback, response) {

	var pwd = crypto.encrypt(context.password);
	var that = this;
	var user = [];
	var failed1 = function(dataset, err) { console.log("fail-users-authenticate"); console.log(err); callback(400, [], response);};
	
	var p1CheckPassword = function(dataset, err) {
		if (dataset === undefined || dataset[0] == undefined) callback(400, [], response);
		else if (dataset[0].password == pwd) {
			that.user = dataset[0];
			console.log("user valid : " + that.user.id);
			var params2 = [];
			params2.push({name: "userId" , type: TYPES.VarChar, value: that.user.id});
			params2.push({name: "applicationId" , type: TYPES.VarChar, value: "48DD366E-C25E-4399-960A-F01D04C70002"});
			var p2 = new Promise(function(resolve, reject) { pool.callProcedure("CreateAccess", params2, p2CreateAccess, failed1)});
		}
		else callback(400, {}, response);
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
	params1.push({name: "password" , type: TYPES.VarChar, value: pwd});
	params1.push({name: "group" , type: TYPES.VarChar, value: context.group});
	var p1 = new Promise(function(resolve, reject) { pool.callProcedure("Authenticate", params1, p1CheckPassword, failed1)});
	
	p1.then(p1CheckPassword).then(p2CreateAccess).catch(failed1);
};

exports.create = function(context, callback, response) {
	var failed1 = function(dataset, err) { console.log("fail-users-create"); console.log(err); callback(400, [], response);};
	var f = function(dataset, err) {
		if(err == null) {
			// add new user id to context
			context.id = dataset[0].id;
			callback(200, context, response);
		}		
		else callback(400, [], response);
	};
	
	var params1 = [];
	params1.push({name: "lastName" , type: TYPES.VarChar, value: context.lastName});
	params1.push({name: "firstName" , type: TYPES.VarChar, value: context.firstName});
	params1.push({name: "login" , type: TYPES.VarChar, value: context.login});
	params1.push({name: "password" , type: TYPES.VarChar, value: crypto.encrypt(context.password)});
	params1.push({name: "email" , type: TYPES.VarChar, value: context.email});
	params1.push({name: "groupeRef" , type: TYPES.VarChar, value: context.groupe});
	params1.push({name: "phone" , type: TYPES.VarChar, value: context.phone});
	params1.push({name: "phoneCountryCode" , type: TYPES.VarChar, value: context.phoneCountryCode});
	params1.push({name: "city" , type: TYPES.VarChar, value: context.city});
	var p1 = new Promise(function(resolve, reject) { pool.callProcedure("CreateUser", params1, f, failed1)});
	
	p1.then(f).catch(failed1);
};

exports.update = function(context, callback, response) {
	var failed1 = function(dataset, err) { console.log("fail-users-update"); console.log(err); callback(400, [], response);};
	var f = function(dataset, err) {
		if(err == null) callback(200, context, response);
		else callback(400, [], response);
	};
	
	var params1 = [];
	params1.push({name: "id" , type: TYPES.VarChar, value: context.id});
	params1.push({name: "lastName" , type: TYPES.VarChar, value: context.lastName});
	params1.push({name: "firstName" , type: TYPES.VarChar, value: context.firstName});
	params1.push({name: "phone" , type: TYPES.VarChar, value: context.phone});
	params1.push({name: "phoneCountryCode" , type: TYPES.VarChar, value: context.phoneCountryCode});
	params1.push({name: "city" , type: TYPES.VarChar, value: context.city});
	var p1 = new Promise(function(resolve, reject) { pool.callProcedure("UpdateUser", params1, f, failed1)});
	
	p1.then(f).catch(failed1);
};

exports.get = function(context, callback, response) {
	var failed1 = function(dataset, err) { console.log("fail-user-get"); console.log(err); callback(400, [], response);};
	var f = function(dataset, err) {
		if(err == null) {
			callback(200, dataset, response);
		}		
		else callback(400, [], response);
	};
	
	var params1 = [];
	params1.push({name: "token" , type: TYPES.VarChar, value: context.token});
	var p1 = new Promise(function(resolve, reject) { pool.callProcedure("GetUserByToken", params1, f, failed1)});
	
	p1.then(f).catch(failed1);
};

exports.changePassword = function(context, callback, response) {

	var failed1 = function(dataset, err) { console.log("fail-user-changePassword"); console.log(err); callback(400, {}, response);};
	var f = function(dataset, err) {
		if(err == null) {
			callback(200, dataset, response);
		}		
		else callback(400, [], response);
	};

	var params1 = [];
	console.log(context);
	params1.push({name: "token" , type: TYPES.VarChar, value: context.token});
	params1.push({name: "oldPassword" , type: TYPES.VarChar, value: crypto.encrypt(context.oldPassword)});
	params1.push({name: "newPassword" , type: TYPES.VarChar, value: crypto.encrypt(context.password)});
	var p1 = new Promise(function(resolve, reject) { pool.callProcedure("SetPassword", params1, f, failed1)});

	p1.then(f).catch(failed1);
}