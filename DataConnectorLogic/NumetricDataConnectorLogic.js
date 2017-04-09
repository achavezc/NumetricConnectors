'use strict'

const mapper = require("json2json-transform")
const config = require("../Config/Config")
const utils = require("../Helper/Util")
const NumetricCon = require("../DataConnectorApi/NumetricDataConnectorApi/NumetricDataConnectorApi")


var conf = new config();



var verifyCreateDatasetNumetric = function(datasetName,data,callback)
{
	utils.WriteFileTxt(datasetName);
	
	var found = false;
	var resultEvent = {};
    resultEvent.Result = {}
    resultEvent.Result.Success = false;
	resultEvent.Result.Id = '';
	NumetricCon.getDataSetNumetric().then(result=>
	{ 
	//if(result.Result.Success==false){

		for (var i = 0; i < result.Response.length; i++ )
		{
			if(result.Response[i].name==datasetName)
			{			
				utils.WriteFileTxt("\r\n");
				utils.WriteFileTxt('Existe');	
				utils.WriteFileTxt("\r\n");					
				found=true;
				resultEvent.Result.Id = result.Response[i].id;
				resultEvent.Result.Success = true;
		        return callback(resultEvent);
			}
		}

		if(!found)
		{
			NumetricCon.generateDataSetNumetric(data).then(res=>
			{
				if(res.Result.Success)
				{	
					utils.WriteFileTxt("\r\n");
					utils.WriteFileTxt('Creó');
					utils.WriteFileTxt("\r\n");
					
					resultEvent.Result.Id = res.Response;
					
				}
				resultEvent.Result.Success = res.Result.Success;
				return callback(resultEvent);
		        
			});
		}
	//}
	return callback(resultEvent);
});
}


module.exports=
{	
	verifyCreateDatasetNumetric : verifyCreateDatasetNumetric
}