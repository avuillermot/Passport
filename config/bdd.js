var poolConfig = {
    min: 2,
    max: 4,
    log: true
};

var configuration = {
    "mssql": {		
		"driver": "tedious",
		"userName": "sa",
		"password": "Kerenann06041979",
		"server": "DEV-takedoc.cloudapp.net", // You can use 'localhost\\instance' to connect to named instance 

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