var Request = require('tedious').Request;
var ConnectionPool = require('tedious-connection-pool');
var config = require('../config/bdd');
//create the pool
var mssqlPool = new ConnectionPool(config.poolConfig, config.dbConfig.mssql);

var initParams = function(request, params) {
	if (params != null && params.length > 0) {
		for(var i = 0; i < params.length; i++) {
			request.addParameter(params[i].name, params[i].type, params[i].value);
		}
	}
};

var onRow = function(columns) {
	var dataset = [];
	var item = {};
	columns.forEach(function(column){
		var name = column.metadata.colName; 
      	var value = column.value;
      	item[name] = value;
     });
     dataset.push(item);
	 return dataset;
};

var callRequest = function(sql, params, resolve, reject) {
  var dataset = [];
  mssqlPool.acquire(function (err, connection) {
      if (err)
          console.error(err);
  
      var request = new Request(sql, function(err, rowCount) {
			connection.release();
			if (err == null)resolve(dataset, null);
			else reject(dataset, err);
	  });
	  initParams(request, params);
  
      request.on('row', function(columns) { dataset = onRow(columns);});
      connection.execSql(request);
  });
  
  mssqlPool.on('error', function(err) {
      console.error(err);
  });
};

var callProcedure = function(sql, params, resolve, reject) {
	
  var dataset = [];
  mssqlPool.acquire(function (err, connection) {
      if (err)
          console.error(err);
  
      //use the connection as normal
      var request = new Request(sql, function(err, rowCount) {
			connection.release();
			if (err == null)resolve(dataset, null);
			else reject(dataset, err);
	  });
	  initParams(request, params);
  
      request.on('row', function(columns) { dataset = onRow(columns);});
	  connection.callProcedure(request);
  });
  
  mssqlPool.on('error', function(err) {
      console.error(err);
  });
}

exports.mssqlPool = mssqlPool;
exports.callRequest = callRequest;
exports.callProcedure = callProcedure;