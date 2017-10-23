var poolConfig = {
    min: 2,
    max: 4,
    log: true
};

var configuration = {
    "mssql": {		
		"driver": "tedious",
		"userName": "Carl",
		"password": "wxcvbn123",
		"server": "DEV-TAKEDOC.cloudapp.net", // You can use 'localhost\\instance' to connect to named instance 

		"options": {
			//"instanceName": "sqlexpress",
			"port": 55838,
			"database": "PASSPORT",
			"encrypt": false
		}
	}
}

exports.dbConfig = configuration;
exports.poolConfig = poolConfig;