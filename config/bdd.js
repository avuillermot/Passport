var poolConfig = {
    min: 2,
    max: 4,
    log: true
};

var configuration = {
    "mssql": {		
		"driver": "tedious",
		"userName": "sa",
		"password": "Localdev1992",
		"server": "AZUNYTH", // You can use 'localhost\\instance' to connect to named instance

		"options": {
			//"instanceName": "sqlexpress",
			"port": 49806,
			"database": "PASSPORT",
			"encrypt": false
		}
	}
}

exports.dbConfig = configuration;
exports.poolConfig = poolConfig;