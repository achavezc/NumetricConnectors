'use strict'

const mapper = require("json2json-transform")
const config = require("../Config/Config")
const utils = require("../Helper/Util")
const NumetricCon = require("../DataConnectorApi/NumetricDataConnectorApi/NumetricDataConnectorApi")
const datasetsMixPanel = require("../Model/datasetsMixPanel")


function NumetricMixPanelFormat(inputData,namePk,fieldsName)
{
	var conf = new config();
	return  mapper.transform(inputData, conf.parameters().templateMixPanelEvents, conf.parameters().operations);
}

/*
var NumetricShopifyFormat = function(inputData,namePk,fieldsName){
	return utils.GenerateDataSetsNumetricFromShopify(inputData,"Shopify",namePk,fieldsName);
}
*/


function updateRowsMixPanel(inputMixPanel){
	var conf = new config();
	var JsonResult = {};
	JsonResult["rows"] = [];
	var SizeListData = conf.parameters().SizeListData;
	var listInputs=[];
	
	if(utils.isArray(inputMixPanel.Data)){
		for (var i = 0; i < inputMixPanel.Data.length; i++ ){
			var row = NumetricMixPanelFormat(inputMixPanel.Data[i]);
			utils.GenerateRowsFromMixPanel(row,JsonResult);
		}
	} else {
			var row = NumetricMixPanelFormat(inputMixPanel.Data);
			utils.GenerateRowsFromMixPanel(row,JsonResult);
	}
	
	var dimensionList = JsonResult.rows.length;
					var numberList= Math.ceil((dimensionList/SizeListData));
					for (var i = 1; i < numberList+1; i++ ){
						var start = ( i - 1 ) * SizeListData;
						var end = (i * SizeListData)-1;
						var segmentListRows = JsonResult.rows.slice(start,end);
						var inputRow = {};
						var bodyData = {};
						bodyData.rows = segmentListRows;
						inputRow = utils.CreateProp(inputRow,"id",inputMixPanel.MixPanelEvent.id);
						inputRow = utils.CreateProp(inputRow,"rows",bodyData);
						listInputs.push(inputRow);
					}
	
	var actions = listInputs.map(function(input){ return NumetricCon.updateRowsDataSetNumetric(input.id,input.rows);});
	var results = Promise.all(actions);
	return results;
	//NumetricCon.updateRowsDataSetNumetric(inputMixPanel.MixPanelEvent.id,JsonResult);
}

var generateDataSetMixPanelAux = function(inputMixPanel){

var conf = new config();
var inputData;
if(utils.isArray(inputMixPanel.Data)){
	inputData = inputMixPanel[0];
}else{
	inputData = inputMixPanel;
}

var finalFormatMixPanel = NumetricMixPanelFormat(inputData);
var datasetmixpanel = utils.GenerateDataSetsNumetricFromMixPanel(finalFormatMixPanel);
//console.log(datasetmixpanel.DataSetList[0])
 return datasetmixpanel;
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
	verifyDatasetMixPanel : verifyDatasetMixPanel,
	generateDataSetMixPanelAux : generateDataSetMixPanelAux
}
