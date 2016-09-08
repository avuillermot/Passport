/*
@global test ggg
*/
var Promise = require('promise')
var pool = require("../config/connexion");
var TYPES = require('tedious').TYPES;

/**
 * Service de gestions des utilisateurs
 * @module services/passport
 * @function checkToken
 * @param {LACE_COLORS} color - The shoelace color.
 * @param {LACE_TYPES} type - The type of shoelace.
 */
exports.checkToken = function(context, callback, response) {
	console.log("ask checktoken");
	var that = this;
	var user = [];

	var failed1 = function(dataset, err) { console.log("fail-1"); console.log(err); callback(400, [], response);};
	
	var pCheck = function(dataset, err) {
		if (dataset[0].checked == 1) {
			callback(200, dataset[0], response);
			console.log("token valid : " + context.token);
		}
		else {
			console.log("token invalid : " + context.token);
			callback(401, [], response);
		}
	};
	
	var params1 = [];
	params1.push({name: "tokenId" , type: TYPES.VarChar, value: context.token});
	params1.push({name: "module" , type: TYPES.VarChar, value: context.module});
	var p1 = new Promise(function(resolve, reject) { pool.callProcedure("CheckToken", params1, pCheck, failed1)});
	
	p1.then(pCheck).catch(failed1);
};
/**
 * Service de gestions des utilisateurs
 * @module services/passport
 * @function refreshToken
 */
exports.refreshToken = function(context, callback, response) {
	var that = this;
	var user = [];

	var failed1 = function(dataset, err) { console.log("fail-1"); console.log(err); callback(400, [], response);};
	
	var pCheck = function(dataset, err) {
		if (dataset[0].tokenId !== undefined) {
			callback(200, {tokenId: dataset[0].tokenId}, response);
			console.log("new tokenid valid : " +  dataset[0].tokenId);
		}
		else callback(403, [], response);
	};
	
	var params1 = [];
	params1.push({name: "accessId" , type: TYPES.VarChar, value: context.accessId});
	var p1 = new Promise(function(resolve, reject) { pool.callProcedure("RefreshToken", params1, pCheck, failed1)});
	
	p1.then(pCheck).catch(failed1);
};

