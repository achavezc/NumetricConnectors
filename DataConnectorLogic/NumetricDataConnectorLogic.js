'use strict'

const mapper = require("json2json-transform")
const config = require("../Config/Config")
const utils = require("../Helper/Util")
const NumetricCon = require("../DataConnectorApi/NumetricDataConnectorApi/NumetricDataConnectorApi")


var conf = new config();


var verifyCreateManyDatasetNumetric = function(arrDataSetNames,currentListDataSet,dataSetBodys){
	var actions = arrDataSetNames.map(function(input){ return verifyCreateDatasetNumetric(input,dataSetBodys,currentListDataSet);});
	var results = Promise.all(actions);
	return results;
}


var verifyCreateDatasetNumetric = function(datasetName,data,currentListDataset) //callback
{	
	var found = false;
	var resultEvent = {};
    resultEvent["Result"] = {}
    resultEvent.Result["Success"] = false;
    resultEvent.Result["datasetName"] = datasetName;
	resultEvent.Result["Id"] = '';

	//return NumetricCon.getDataSetNumetric().then(result=>{
	return new Promise(function(sendDataSetId,sendCatch) {
	 
	//if(result.Result.Success==false){
		for (var i = 0; i < currentListDataset.Response.length; i++ )
		{
			if(currentListDataset.Response[i].name==datasetName)
			{										
				found=true;
				resultEvent.Result.Id = currentListDataset.Response[i].id;
				resultEvent.Result.Success = true;
  						sendDataSetId(resultEvent);
				//});
				//return resultEvent
		        //callback(resultEvent);
			}
		}

		if(!found)
		{
			var datasetBody = SearchDataSet(datasetName,data);
			NumetricCon.generateDataSetNumetric(datasetBody.Data).then(res=>
			{
				if(res.Result.Success)
				{	
					resultEvent.Result.Id = res.Response.id;					
				}
				resultEvent.Result.Success = res.Result.Success;
				//callback(resultEvent);
		        //return resultEvent;
		        sendDataSetId(resultEvent);
			})
			.catch(err=>{
				sendCatch(err);
			});
		}
	//}
		//return callback(resultEvent);
		sendDataSetId(resultEvent);
	});
}

var SearchDataSet = function(datsetName,dataSetList){

	var found = false;
	var resultEvent = {};
    resultEvent["Result"] = {}
    resultEvent.Result["Success"] = false;
	resultEvent.Result["Data"] = {};

	for (var i = 0; i < dataSetList.length; i++ ) {
		if(dataSetList[i].name === datsetName){
			resultEvent.Success = true;
			resultEvent.Data = dataSetList[i];
			return resultEvent;
		}
	}

	if(!found){
		resultEvent.Success = false;
		return resultEvent;
	}
}


module.exports=
{	
	verifyCreateManyDatasetNumetric : verifyCreateManyDatasetNumetric
}