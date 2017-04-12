'use strict'

const config = require("../Config/Config")
const utils = require("../Helper/Util")
const datasetsShopify = require("../Model/datasetsShopify")
const NumetricCon = require("../DataConnectorApi/NumetricDataConnectorApi/NumetricDataConnectorApi")
var conf = new config();

var NumetricShopifyFormat = function(inputData,namePk,fieldsName){
	return utils.GenerateDataSetsNumetricFromShopify(inputData,"Shopify",namePk,fieldsName);
}

function getRowsShopify(inputShopify,jsonListRows,namePrincipalList){ //namesSecondaryList
	if(utils.isArray(inputShopify)){
			for (var i = 0; i < inputShopify.length; i++ ){
				utils.GenerateRowsListFromShopify(inputShopify[i],jsonListRows,namePrincipalList,null,null,false); //namesSecondaryList
			}
		} else {
				utils.GenerateRowsListFromShopify(inputShopify,jsonListRows,namePrincipalList,null,null,false); //namesSecondaryList
		}
}

//METODO FINAL QUE USARE PARA CARGAR CUALQUIER DATA A SU DATASET CORRESPONDIENTE EN NUMETRIC
var sendRowsShopifyToNumetric = function(inputsShopify){
	var datasetId = "";
	var JsonResult = {};
	var props = Object.keys(inputsShopify.Data);
	var nameParent;
	var SizeListData = conf.parameters().SizeListData;
	
	if(props.length>0){
		nameParent = props[0]; 
	}
	JsonResult[nameParent] = {};
	JsonResult[nameParent]["rows"]=[];

	getRowsShopify(inputsShopify.Data[nameParent],JsonResult,nameParent); 
	var props = Object.keys(inputsShopify);
	var listInputs=[];

		for(var property in JsonResult){
			if(utils.isInclude(props,property)){
				if(inputsShopify[property].id !== ''){
					
					var dimensionList = JsonResult[property].rows.length;
					var numberList= Math.ceil((dimensionList/SizeListData));
					for (var i = 1; i < numberList+1; i++ ){
						var start = ( i - 1 ) * SizeListData;
						var end = (i * SizeListData)-1;
						var segmentListRows = JsonResult[property].rows.slice(start,end);
						var inputRow = {};
						var bodyData = {};
						bodyData.rows = segmentListRows;
						inputRow = utils.CreateProp(inputRow,"id",inputsShopify[property].id);
						inputRow = utils.CreateProp(inputRow,"rows",bodyData);
						listInputs.push(inputRow);
					}
				}
			}
		}
	
	var actions = listInputs.map(function(input){ return NumetricCon.updateRowsDataSetNumetric(input.id,input.rows);});
	var results = Promise.all(actions);
	return results;
}


module.exports ={
NumetricShopifyFormat : NumetricShopifyFormat,
sendRowsShopifyToNumetric : sendRowsShopifyToNumetric
}
