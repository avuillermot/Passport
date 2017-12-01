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
		"server": "Front-carl", // You can use 'localhost\\instance' to connect to named instance 
		"database": "PASSPORT",
		"options": {
			//"instanceName": "SQLEXPRESS"
			"port": 1433,
			//"database": "PASSPORT"
			"encrypt": false
		}
	}
}

exports.dbConfig = configuration;
exports.poolConfig = poolConfig;