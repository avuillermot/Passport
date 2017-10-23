var messagebird = require('messagebird')('O1017bUGN1ng3Iu0tDSRdYd66');
var sUsers = require("../services/user");
var httpConfig = require("../config/http");

global.app.post('/mobile/verify', function(request, response){
	console.log("Ask token for verify phone number");
	if (request.body == null || request.body.indicatif == null ||  request.body.mobile == null) {
		httpConfig.callback(400,[],response);
		return;
	}

	var countryCode = request.body.indicatif;
	var mobile = request.body.mobile;

	// mettre le telephone au format international avec indicatif
	if (mobile.substring(0,1) === "0") mobile = mobile.substring(1);
	var send = countryCode + mobile;

	messagebird.verify.create(send, {timeout: 600, template: "Votre code de vérification Carl: %token"}, 
		function (err, data) {
			console.log(err);
			/*if (err) httpConfig.callback(400,{},response);
  			else httpConfig.callback(200,data,response);*/
  			httpConfig.callback(200,{id: 'simulation'},response)
  		}
	);
});

global.app.post('/mobile/check', function(request, response){
	messagebird.verify.verify(request.body.verifyId, request.body.tokenId, 
		function (err, data) {
			console.log("Error while check :");
			console.log(err);
  			/*if (err) {
  				httpConfig.callback(400,{message: "Code de confirmation non valide."},response);
  			}
  			else {*/
  				var context = {
  					idUser: request.body.idUser,
  					verifyId: request.body.verifyId,
  					tokenId: request.body.tokenId
  				};
  				sUsers.setMobileChecked(context, null, null);
  				httpConfig.callback(200,{},response);
  			//}
  		}
	);
});
