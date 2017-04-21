'use strict';

const mapper = require("json2json-transform");
const config = require("../Config/Config");
const utils = require("../Helper/Util");
const numetricCon = require("../DataConnectorApi/NumetricDataConnectorApi/NumetricDataConnectorApi");



function NumetricMixPanelFormat(inputData)
{
	var conf = new config();
	var result = mapper.transform(inputData, conf.parameters().plantillaJsonDestino, conf.operations);
    return result[""];
}


function updateRowsMixPanel(inputMixPanel)
{
	var conf = new config();
	var JsonResult = {};
	JsonResult["rows"] = [];
	var SizeListData = conf.parameters().SizeListData;
	var listInputs=[];
	
	if(utils.isArray(inputMixPanel.Data))
	{
		for (var i = 0; i < inputMixPanel.Data.length; i++ )
		{
			var row = NumetricMixPanelFormat(inputMixPanel.Data[i]);
			utils.GenerateRowsFromMixPanel(row,JsonResult);
		}
	} else 
	{
			var row = NumetricMixPanelFormat(inputMixPanel.Data);
			utils.GenerateRowsFromMixPanel(row,JsonResult);
	}
	
	var dimensionList = JsonResult.rows.length;
	
	var numberList= Math.ceil((dimensionList/SizeListData));
	
	for (var i = 1; i < numberList+1; i++ )
	{
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
	
	var actions = listInputs.map(function(input){ return numetricCon.updateRowsDataSetNumetric(input.id,input.rows);});
	return Promise.all(actions);
	
}

var generateDataSetMixPanelAux = function(inputMixPanel)
{
	var inputData;
	if(utils.isArray(inputMixPanel.Data))
	{
		
		inputData = inputMixPanel.Data[0];
	}
	else
	{
		inputData = inputMixPanel;
	}
	
	var finalFormatMixPanel = NumetricMixPanelFormat(inputData);

	return utils.GenerateDataSetsNumetricFromMixPanel(finalFormatMixPanel);
};



module.exports=
{
	updateRowsMixPanel : updateRowsMixPanel,	
	generateDataSetMixPanelAux : generateDataSetMixPanelAux
};
