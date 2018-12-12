var messagebird = require('messagebird')(process.env.MESSAGEBIRD_API_KEY);
var httpConfig = require("../config/http");
var sUsers = require("../services/user");

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
    var phone = countryCode + mobile;

    messagebird.verify.create(phone, {
            originator : 'Carl',
            template : 'Votre code de verification Carl : %token',
            timeout: 600
        }, function (err, data) {
            if (err) {
                console.log(err);
                httpConfig.callback(400,{},response);
            } else {
                console.log(data);
                httpConfig.callback(200,data,response);
                //httpConfig.callback(200,{id: 'simulation'},response)
            }
        }
    );
});

global.app.post('/mobile/check', function(request, response){
    messagebird.verify.verify(request.body.verifyId, request.body.tokenId,
        function (err, data) {
            // console.log("Error during check :");
            // console.log(err);
            // if (err != null) {
            //     httpConfig.callback(400,{message: "Code de confirmation non valide."},response);
            // }
            // else {
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

// global.app.post('/mobile/take/charge', function(request, response){
// 	if (request.body == null || request.body.indicatif == null ||  request.body.mobile == null) {
// 		httpConfig.callback(400,[],response);
// 		return;
// 	}
//
// 	var params = {
// 	  'originator': 'Carl-Move',
// 	  'recipients': [
// 	    '31612345678'
// 	  ],
// 	  'body': 'Votre trajet est pris en charge.'
// 	};
//
// 	messagebird.messages.create(params, function (err, response) {
// 	  if (err) httpConfig.callback(200,{},response);
// 	  else httpConfig.callback(400,{},response);
// 	});
// });



