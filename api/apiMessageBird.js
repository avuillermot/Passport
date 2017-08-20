var messagebird = require('messagebird')('SvZ4MavApsJ4d0I1Xe7Kkfd3Q');
var httpConfig = require("../config/http");

global.app.post('/mobile/verify', function(request, response){
	
	if (request.body == null || request.body.indicatif == null ||  request.body.mobile == null) {
		httpConfig.callback(400,[],response);
		return;
	}

	var countryCode = request.body.indicatif;
	var mobile = request.body.mobile;

	// mettre le telephone au format international avec indicatif
	if (mobile.substring(0,1) === "0") mobile = mobile.substring(1);
	var send = countryCode + mobile;

	messagebird.verify.create(send, 
		function (err, data) {
			//console.log(data);
			if (err) httpConfig.callback(200,{},response);
  			else httpConfig.callback(200,data,response);
  		}
	);
});

global.app.post('/mobile/check', function(request, response){
	console.log(request.body);
	messagebird.verify.verify(request.body.verifyId, request.body.tokenId, 
		function (err, data) {
  			/*if (err) {
  				httpConfig.callback(400,{message: "Code de confirmation non valide."},response);
    			console.log(err);
  			}
  			else*/ httpConfig.callback(200,{},response);
  		}
	);
});

global.app.post('/mobile/take/charge', function(request, response){
	if (request.body == null || request.body.indicatif == null ||  request.body.mobile == null) {
		httpConfig.callback(400,[],response);
		return;
	}

	var params = {
	  'originator': 'Carl-Move',
	  'recipients': [
	    '31612345678'
	  ],
	  'body': 'Votre trajet est pris en charge.'
	};

	messagebird.messages.create(params, function (err, response) {
	  if (err) httpConfig.callback(200,{},response);
	  else httpConfig.callback(400,{},response);
	});
});



