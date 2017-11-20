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
		"server": "dev-takedoc.cloudapp.net", // You can use 'localhost\\instance' to connect to named instance 
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