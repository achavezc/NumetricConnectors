'use strict'

const mapper = require("json2json-transform")
const config = require("../Config/Config")
const utils = require("../Helper/Util")
const NumetricCon = require("../DataConnectorApi/NumetricDataConnectorApi/NumetricDataConnectorApi")
const datasetsMixPanel = require("../Model/datasetsMixPanel")


function NumetricMixPanelFormat(inputData){
	var conf = new config();
 var result = mapper.transform(inputData, conf.parameters().plantillaJsonDestino, conf.parameters().operations);
 return result[""];
}


function updateRowsMixPanel(inputMixPanel){
	var JsonResult = {};
	JsonResult["rows"] = [];
	
	if(utils.isArray(inputMixPanel)){
		for (var i = 0; i < inputMixPanel.length; i++ ){
			var row = NumetricMixPanelFormat(inputMixPanel[i]);
			utils.GenerateRowsFromMixPanel(row,JsonResult);
		}
	} else {
			var row = NumetricMixPanelFormat(inputMixPanel);
			utils.GenerateRowsFromMixPanel(row,JsonResult);
	}
	
	/*
	var lstBatch = {};
	lstBatch["rows"] = [];
	for(i=0; i<JsonResult["rows"].length; i++){
		lstBatch["rows"].push(JsonResult["rows"][i]);
		if( (i % 1000) == 0){
			console.log("demo");
			NumetricCon.updateRowsDataSetNumetric(datasetsMixPanel.datasetMixPanelEventId.id,lstBatch,rowsCount);
			lstBatch["rows"] = [];
		}
	}
	*/
	NumetricCon.updateRowsDataSetNumetric(datasetsMixPanel.datasetMixPanelEventId.id,JsonResult);
}

var generateDataSetMixPanelAux = function(inputMixPanel){

var conf = new config();
var finalFormatMixPanel = NumetricMixPanelFormat(inputMixPanel);
var datasetmixpanel = utils.GenerateDataSetsNumetricFromMixPanel(finalFormatMixPanel);
//console.log(datasetmixpanel.DataSetList[0])

} 

var verifyDatasetMixPanel = function(){

	var found = false;
	var resultEvent = {};
    resultEvent.Result = {}
    resultEvent.Result.Success = false;
	return NumetricCon.getDataSetNumetric().then(result=>{ 
	//if(result.Result.Success==false){

		for (var i = 0; i < result.Response.length; i++ ) {
			if(result.Response[i].name==datasetsMixPanel.datasetMixPanelEvent.name){
				found=true;
				datasetsMixPanel.datasetMixPanelEventId = {id:result.Response[i].id};
				resultEvent.Result.Success = true;
		        return resultEvent;
			}
		}

		if(!found){
			NumetricCon.generateDataSetNumetric(datasetsMixPanel.datasetMixPanelEvent).then(res=>{
				if(res.Result.Success){
					datasetsMixPanel.datasetMixPanelEventId = res.Response;
				}
				resultEvent.Result.Success = res.Result.Success;
		        return resultEvent;
			});
		}
	//}
	return result;
});
}


module.exports={
	updateRowsMixPanel : updateRowsMixPanel,
	verifyDatasetMixPanel : verifyDatasetMixPanel
}