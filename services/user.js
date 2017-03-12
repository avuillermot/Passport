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
		if (dataset === undefined || dataset[0] == undefined) {
			console.log("user not exists");
			callback(400, [], response);
		}
		else if (dataset[0].password == pwd) {
			that.user = dataset[0];
			console.log("user valid : " + that.user.id);
			var params2 = [];
			params2.push({name: "userId" , type: TYPES.VarChar, value: that.user.id});
			params2.push({name: "applicationId" , type: TYPES.VarChar, value: "48DD366E-C25E-4399-960A-F01D04C70002"});
			var p2 = new Promise(function(resolve, reject) { pool.callProcedure("CreateAccess", params2, p2CreateAccess, failed1)});
		}
		else {
			that.user = dataset[0];
			console.log("user invalid password : " + that.user.id);
			callback(400, {}, response);
		}
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
	params1.push({name: "group1" , type: TYPES.VarChar, value: context.group1});
	params1.push({name: "group2" , type: TYPES.VarChar, value: context.group2});
	var p1 = new Promise(function(resolve, reject) { pool.callProcedure("Authenticate", params1, p1CheckPassword, failed1)});
	
	p1.then(p1CheckPassword).then(p2CreateAccess).catch(failed1);
};

exports.authenticateV2 = function(context, callback, response) {

	var pwd = crypto.encrypt(context.password);
	var that = this;
	var user = [];
	var failed1 = function(dataset, err) { console.log("fail-users-authenticatev2"); console.log(err); callback(400, [], response);};
	
	var p1CheckPassword = function(dataset, err) {
		if (dataset === undefined || dataset[0] == undefined) {
			console.log("user not exists");
			callback(400, [], response);
		}
		else if (dataset[0].password == pwd) {
			that.user = dataset[0];
			console.log("user valid : " + that.user.id);
			var params2 = [];
			params2.push({name: "userId" , type: TYPES.VarChar, value: that.user.id});
			params2.push({name: "applicationId" , type: TYPES.VarChar, value: "48DD366E-C25E-4399-960A-F01D04C70002"});
			var p2 = new Promise(function(resolve, reject) { pool.callProcedure("CreateAccess", params2, p2CreateAccess, failed1)});
		}
		else {
			that.user = dataset[0];
			console.log("user invalid password : " + that.user.id);
			callback(400, {}, response);
		}
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
	var p1 = new Promise(function(resolve, reject) { pool.callProcedure("AuthenticateV2", params1, p1CheckPassword, failed1)});
	
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
	params1.push({name: "address1" , type: TYPES.VarChar, value: context.address1});
	//params1.push({name: "address2" , type: TYPES.VarChar, value: context.address2});
	params1.push({name: "fullAddress" , type: TYPES.VarChar, value: context.fullAddress});
	params1.push({name: "zip" , type: TYPES.VarChar, value: context.zip});
	params1.push({name: "city" , type: TYPES.VarChar, value: context.city});
	params1.push({name: "country" , type: TYPES.VarChar, value: context.country});
	params1.push({name: "paymentRefUser" , type: TYPES.VarChar, value: context.paymentRefUser});
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
	params1.push({name: "address1" , type: TYPES.VarChar, value: context.address1});
	//params1.push({name: "address2" , type: TYPES.VarChar, value: context.address2});
	params1.push({name: "fullAddress" , type: TYPES.VarChar, value: context.fullAddress});
	params1.push({name: "zip" , type: TYPES.VarChar, value: context.zip});
	params1.push({name: "city" , type: TYPES.VarChar, value: context.city});
	params1.push({name: "country" , type: TYPES.VarChar, value: context.country});
	if (context.deleted != null && context.deleted != undefined) params1.push({name: "deleted" , type: TYPES.VarChar, value: context.deleted});
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

exports.generatePassword = function(context, callback, response) {

	var failed1 = function(dataset, err) { console.log("fail-user-generatePassword"); console.log(err); callback(400, {}, response);};
	var f = function(dataset, err) {
		if(err == null) {
			callback(200, dataset, response);
		}		
		else callback(400, [], response);
	};

	var params1 = [];
	console.log(context);
	params1.push({name: "email" , type: TYPES.VarChar, value: context.email});
	params1.push({name: "newPassword" , type: TYPES.VarChar, value: crypto.encrypt(context.password)});
	var p1 = new Promise(function(resolve, reject) { pool.callProcedure("GeneratePassword", params1, f, failed1)});

	p1.then(f).catch(failed1);
};

exports.convertGoogleAddress = function(googlePlace) {
	var back = {
		address1: ""
	};
	back.fullAddress =  googlePlace.formatted_address;
    var streetNumber = "";
    var address1 = "";
        for (var i = 0; i < googlePlace.address_components.length; i++) {
            var current = googlePlace.address_components[i];
            if (current.types != undefined) {
            if (current.types[0] == "street_number") streetNumber = current.long_name; 
            else if (current.types[0] == "country") back.country = current.short_name;
            else if (current.types[0] == "postal_code") back.zip = current.long_name;
            else if (current.types[0] == "locality") back.city = current.long_name;
            else if (current.types[0] == "route") address1 = current.long_name;
        	}
        }
    back.address1 = streetNumber + " " + address1;
    if (back.address1.replace(" ","") == "" || back.address1 == undefined) back.address1 = back.fullAddress;

    return back;
};