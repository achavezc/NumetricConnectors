'use strict'

const config = require("../../Config/Config")
const rp = require('request-promise')
//const seq = require("../../sequence").Sequence

var getDataSetNumetric = function(){
	var conf = new config();
	var resultEvent = {};
    resultEvent.Result = {}
    resultEvent.Result.Success = false;

    return rp(conf.parameters().optionsGetDataSet).then(response =>{
		     resultEvent.Response  = response;
        	 resultEvent.Result.Success = true;
		     return resultEvent;
			})
			.catch(function(err){ 
			    resultEvent.Result.Success = false;
        		resultEvent.Result.Error = err;
        		return resultEvent;
			});
}

var getDataSetNumetricById = function(datasetId){
	var conf = new config(datasetId);
	var resultEvent = {};
    resultEvent.Result = {}
    resultEvent.Result.Success = false;

	return rp(conf.parameters().optionsGetDataSetById).then(response =>{
     		 resultEvent.Response  = response;
        	 resultEvent.Result.Success = true;
		     return resultEvent;
	})
	.catch(function(err){ 
			resultEvent.Result.Success = false;
        	resultEvent.Result.Error = err;
        	return resultEvent;
	});
}

var generateDataSetNumetric = function(data){
	var conf = new config();
	var resultEvent = {};
    resultEvent.Result = {}
    resultEvent.Result.Success = false;

	return rp(conf.parameters(data).optionsCreateDataSet).then(response =>{
     		 resultEvent.Response  = response;
        	 resultEvent.Result.Success = true;
		     return resultEvent;
	})
	.catch(function(err){ 
			resultEvent.Result.Success = false;
        	resultEvent.Result.Error = err;
        	return resultEvent;
	});
}

var updateRowsDataSetNumetric = function(datasetId,data,rowsCount){
	var conf = new config(datasetId);
	var resultEvent = {};
    resultEvent.Result = {}
    resultEvent.Result.Success = false;
    console.log(rowsCount);
  /*
	return rp(conf.parameters(data).optionsUpdateRowsDataSet).then(response =>{
     		 resultEvent.Response  = response;
        	 resultEvent.Result.Success = true;
			// console.log(response);
		     return resultEvent;
	}).catch(function(err){ 
			//console.log(err);
			resultEvent.Result.Success = false;
        	resultEvent.Result.Error = err;
        	return resultEvent;
	});
	*/
}

var getRowsDataSetNumetric = function(datasetId){
	var conf = new config(datasetId);
	var resultEvent = {};
    resultEvent.Result = {}
    resultEvent.Result.Success = false;

	return rp(conf.parameters().optionsGetRowsDataSet).then(response =>{
     		 resultEvent.Response  = response;
        	 resultEvent.Result.Success = true;
		     return resultEvent;
	})
	.catch(function(err){ 
			resultEvent.Result.Success = false;
        	resultEvent.Result.Error = err;
        	return resultEvent;
	});
}

var deleteRowsDataSetNumetric = function(datasetId,data){
	var conf = new config(datasetId);
	var resultEvent = {};
    resultEvent.Result = {}
    resultEvent.Result.Success = false;

	return rp(conf.parameters(data).optionsDeleteRowsDataSet).then(response =>{
     		 resultEvent.Response  = response;
        	 resultEvent.Result.Success = true;
		     return resultEvent;
	})
	.catch(function(err){ 
			resultEvent.Result.Success = false;
        	resultEvent.Result.Error = err;
        	return resultEvent;
	});
}

module.exports = {
	getDataSetNumetric: getDataSetNumetric,
	getDataSetNumetricById : getDataSetNumetricById,
	generateDataSetNumetric : generateDataSetNumetric,
	updateRowsDataSetNumetric : updateRowsDataSetNumetric,
	getRowsDataSetNumetric: getRowsDataSetNumetric,
	deleteRowsDataSetNumetric : deleteRowsDataSetNumetric
}