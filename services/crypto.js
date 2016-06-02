var CryptoJS = require("crypto-js");

var secretKey = "camzoeleo2000";

exports.encrypt = function(txt) {
	// Encrypt 
	var ciphertext = CryptoJS.SHA256(txt, secretKey);
	 
	return ciphertext.toString();

};

/*exports.decrypt = function(ciphertext) {
	var bytes  = CryptoJS.SHA256.decrypt(ciphertext.toString(), secretKey);
	var plaintext = bytes.toString(CryptoJS.enc.Utf8);
};*/