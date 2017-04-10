'use strict'

const config = require("../Config/Config")
const utils = require("../Helper/Util")
const datasetsShopify = require("../Model/datasetsShopify")
const NumetricCon = require("../DataConnectorApi/NumetricDataConnectorApi/NumetricDataConnectorApi")


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
	if(props.length>0){
		nameParent = props[0]; 
	}
	JsonResult[nameParent] = {};
	JsonResult[nameParent]["rows"]=[];

	getRowsShopify(inputsShopify.Data[nameParent],JsonResult,nameParent); 
	var props = Object.keys(inputsShopify);

	for(var property in JsonResult){
		if(utils.isInclude(props,property)){
			datasetId = inputsShopify[property].id;
			if(datasetId !== '')
				NumetricCon.updateRowsDataSetNumetric(datasetId,JsonResult[property]);
		}
	}
}


module.exports ={
NumetricShopifyFormat : NumetricShopifyFormat,
sendRowsShopifyToNumetric : sendRowsShopifyToNumetric
}