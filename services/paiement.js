var mangopay = require('mangopay2-nodejs-sdk');
var q = require('q');

var api = new mangopay({
    clientId: 'carlpaiementapi',
    clientPassword: 'wj3YKUDO3E0kY6LkvjtKgwHJCOTfZsNMyBsWM7n4DdVhBZciZp',
    baseUrl: 'https://api.sandbox.mangopay.com'
});


exports.updateUser = function(q1, context) {

    var fnUpdate = function() {
        var data =  {
            "Id": context.paymentRefUser,
            "FirstName": context.firstName,
            "LastName": context.lastName,
            "Address": context.city,
            "CountryOfResidence": context.country,
            "Nationality": "FR",
            "Birthday": 946681200,
            "PersonType": "NATURAL",
            "Email": context.email,
            "Tag": context.id,
            "Address" : {
                "AddressLine1": context.address1,
                "City": context.city,
                "PostalCode": (context.zip != null) ? context.zip : "00000",
                "Country": context.country
            }
        };
        api.Users.update(data).then(
            function() {q1.resolve(arguments);},
            function() {q1.reject(arguments);}
        );
    };
    fnUpdate();

};
