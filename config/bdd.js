var poolConfig = {
    min: 2,
    max: 4,
    log: true
};

var configuration = {
    "mssql": {		
		"driver": "tedious",
		"userName": "carl",
		"password": "Kerenann06041979",
		"server": "13.95.123.103", // You can use 'localhost\\instance' to connect to named instance 
		"database": "PASSPORT",
		"options": {
			//"instanceName": "SQLEXPRESS"
			"port": 49363,
			//"database": "PASSPORT"
			"encrypt": false
		}
	}
}

exports.dbConfig = configuration;
exports.poolConfig = poolConfig;