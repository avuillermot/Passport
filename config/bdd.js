var poolConfig = {
    min: 2,
    max: 4,
    log: true
};

var configuration = {
    mssql: {		
		driver: "tedious",
		userName: "carl",
		password: "Kerenann06041979",
		//server: "front-carl",
		server: "front-carl.westeurope.cloudapp.azure.com", // You can use 'localhost\\instance' to connect to named instance 
		//server: "52.175.166.28",
		options: {
			//port: 49363,
			database: "PASSPORT",
			instancename: 'SQLEXPRESS'
		}
	}
}

exports.dbConfig = configuration;
exports.poolConfig = poolConfig;