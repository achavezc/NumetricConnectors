'use strict'

const mapper = require("json2json-transform")
const config = require("../Config/Config")
const utils = require("../Helper/Util")
const NumetricCon = require("../DataConnectorApi/NumetricDataConnectorApi/NumetricDataConnectorApi")


var conf = new config();



var verifyCreateDatasetNumetric = function(datasetName,data) //callback
{	
	var found = false;
	var resultEvent = {};
    resultEvent["Result"] = {}
    resultEvent.Result["Success"] = false;
	resultEvent.Result["Id"] = '';

	return NumetricCon.getDataSetNumetric().then(result=>
	{ 
	//if(result.Result.Success==false){
		for (var i = 0; i < result.Response.length; i++ )
		{
			if(result.Response[i].name==datasetName)
			{										
				found=true;
				resultEvent.Result.Id = result.Response[i].id;
				resultEvent.Result.Success = true;
				return resultEvent
		        //callback(resultEvent);
			}
		}
		
		if(!found)
		{
			
			var datasetBody = SearchDataSet(datasetName,data);
			if(datasetBody.Success){
				
				return NumetricCon.generateDataSetNumetric(datasetBody.Data).then(res=>
				{
					if(res.Result.Success)
					{	
						resultEvent.Result.Id = res.Response.id;					
					}
					resultEvent.Result.Success = res.Result.Success;
					//callback(resultEvent);
					return resultEvent;
				});
			}else{
				resultEvent.Result.Success = false;
				return resultEvent;
			}
		}
	//}
		//return callback(resultEvent);
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
	verifyCreateDatasetNumetric : verifyCreateDatasetNumetric
}