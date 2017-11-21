var poolConfig = {
    min: 2,
    max: 4,
    log: true
};

var configuration = {
    "mssql": {		
		"driver": "tedious",
		"userName": "carl",
		"password": "wxcvbn123",
		"server": "DEV-TAKEDOC", // You can use 'localhost\\instance' to connect to named instance 

		"options": {
			//"instanceName": "sqlexpress",
			"port": 49363,
			"database": "PASSPORT",
			"encrypt": false
		}
	}
}

exports.dbConfig = configuration;
exports.poolConfig = poolConfig;