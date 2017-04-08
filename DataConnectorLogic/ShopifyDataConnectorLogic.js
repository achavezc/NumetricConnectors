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

var getRowsShopifyEvent = function(inputsShopify){
	var datasetId = "";
	var JsonResult = {};
	var namesDatasetChild =  [];
	JsonResult["events"] = {};
	JsonResult["events"]["rows"]=[];
	getRowsShopify(inputsShopify,JsonResult,"events",namesDatasetChild);
	for(var property in JsonResult){
		switch (property) {
			case 'events'   : datasetId = datasetsShopify.datasetEventId.id; 
		}
		NumetricCon.updateRowsDataSetNumetric(datasetId,JsonResult[property]);
	}
}

var getRowsShopifyCustomCollection = function(inputsShopify){
	var datasetId = "";
	var JsonResult = {};
	var namesDatasetChild =  [];
	JsonResult["custom_collections"] = {};
	JsonResult["custom_collections"]["rows"]=[];
	getRowsShopify(inputsShopify,JsonResult,"custom_collections",namesDatasetChild);
	for(var property in JsonResult){
		switch (property) {
			case 'custom_collections'   : datasetId = datasetsShopify.datasetCustomCollectionId.id; 
		}
		NumetricCon.updateRowsDataSetNumetric(datasetId,JsonResult[property]);
	}
}

var getRowsShopifyComment = function(inputsShopify){
	var datasetId = "";
	var JsonResult = {};
	var namesDatasetChild =  [];
	JsonResult["comments"] = {};
	JsonResult["comments"]["rows"]=[];
	getRowsShopify(inputsShopify,JsonResult,"comments",namesDatasetChild);
	for(var property in JsonResult){
		switch (property) {
			case 'comments'   : datasetId = datasetsShopify.datasetCommentId.id; 
		}
		NumetricCon.updateRowsDataSetNumetric(datasetId,JsonResult[property]);
	}
}

var getRowsShopifyProduct = function(inputsShopify){
	var datasetId = "";
	var JsonResult = {};
	var namesDatasetChild =  ["variants","options","images"];
	JsonResult["products"] = {};
	JsonResult["products"]["rows"]=[];
	JsonResult["variants"] = {};
	JsonResult["variants"]["rows"]=[];
	JsonResult["options"] = {};
	JsonResult["options"]["rows"]=[];
	JsonResult["images"] = {};
	JsonResult["images"]["rows"]=[];
	getRowsShopify(inputsShopify,JsonResult,"products",namesDatasetChild);
	for(var property in JsonResult){
		switch (property) {
			case 'products'   : datasetId = datasetsShopify.datasetProductId.id; break;
			case 'variants' : datasetId = datasetsShopify.datasetProductVariantId.id; break;
			case 'options' : datasetId = datasetsShopify.datasetProductOptionId.id; break;
			case 'images' : datasetId = datasetsShopify.datasetProductImagesId.id; break;
		}
		NumetricCon.updateRowsDataSetNumetric(datasetId,JsonResult[property]);
	}
}

var getRowsShopifySmartCollection = function(inputsShopify){
	var datasetId = "";
	var JsonResult = {};
	var namesDatasetChild =  [];
	JsonResult["smart_collections"] = {};
	JsonResult["smart_collections"]["rows"]=[];
	getRowsShopify(inputsShopify,JsonResult,"smart_collections",namesDatasetChild);
	for(var property in JsonResult){
		switch (property) {
			case 'smart_collections'   : datasetId = datasetsShopify.datasetSmartCollectionId.id; 
		}
		NumetricCon.updateRowsDataSetNumetric(datasetId,JsonResult[property]);
	}
}

var getRowsShopifyCustomer = function(inputsShopify,datasetId){
	//var datasetId = "";
	var JsonResult = {};
	//var namesDatasetChild =  ["addresses"];
	var props = Object.keys(inputsShopify.Data);
	var nameParent;
	if(props.length>0){
		nameParent = props[0]; 
	}
	JsonResult[nameParent] = {};
	JsonResult[nameParent]["rows"]=[];
	//JsonResult["addresses"] = {};
	//JsonResult["addresses"]["rows"]=[];

	getRowsShopify(inputsShopify.Data[nameParent],JsonResult,nameParent); //namesDatasetChild

	//utils.WriteFileTxt(JSON.stringify(JsonResult));
	
	for(var property in JsonResult){
		
		switch (property) {
			case 'customers'   : datasetId = inputsShopify.datasetCustomerId; break;
			case 'customers_default_address' : datasetId = inputsShopify.datasetCustomerDefaultAddressId; break;
			case 'customers_addresses' : datasetId = inputsShopify.datasetCustomerAddressId; break;
		}
		
		NumetricCon.updateRowsDataSetNumetric(datasetId,JsonResult[property]);
	}
}

var getRowsShopifyTransaction = function(inputsShopify){
	var datasetId = "";
	var JsonResult = {};
	var namesDatasetChild =  [];
	JsonResult["transactions"] = {};
	JsonResult["transactions"]["rows"]=[];
	getRowsShopify(inputsShopify,JsonResult,"transactions",namesDatasetChild);
	for(var property in JsonResult){
		switch (property) {
			case 'transactions'   : datasetId = datasetsShopify.datasetTransactionId.id; 
		}
		NumetricCon.updateRowsDataSetNumetric(datasetId,JsonResult[property]);
	}
}

var getRowsShopifyArticle = function(inputsShopify){
	var datasetId = "";
	var JsonResult = {};
	var namesDatasetChild =  [];
	JsonResult["articles"] = {};
	JsonResult["articles"]["rows"]=[];
	getRowsShopify(inputsShopify,JsonResult,"articles",namesDatasetChild);
	for(var property in JsonResult){
		switch (property) {
			case 'articles'   : datasetId = datasetsShopify.datasetArticleId.id; 
		}
		NumetricCon.updateRowsDataSetNumetric(datasetId,JsonResult[property]);
	}
}

var getRowsShopifyOrder = function(inputsShopify){
	var datasetId = "";
	var JsonResult = {};
	/*var namesDatasetChild =  ["discount_codes","note_attributes","tax_lines","line_items","properties"
							 ,"shipping_lines","fulfillments","refunds","refund_line_items","transactions"];

	JsonResult["orders"] = {};
	JsonResult["orders"]["rows"]=[];

	JsonResult["discount_codes"] = {};
	JsonResult["discount_codes"]["rows"]=[];
	JsonResult["note_attributes"] = {};
	JsonResult["note_attributes"]["rows"]=[];
	JsonResult["tax_lines"] = {};
	JsonResult["tax_lines"]["rows"]=[];
	JsonResult["line_items"] = {};
	JsonResult["line_items"]["rows"]=[];
	JsonResult["properties"] = {};
	JsonResult["properties"]["rows"]=[];
    JsonResult["shipping_lines"] = {};
	JsonResult["shipping_lines"]["rows"]=[];
	JsonResult["fulfillments"] = {};
	JsonResult["fulfillments"]["rows"]=[];
	JsonResult["refunds"] = {};
	JsonResult["refunds"]["rows"]=[];
	JsonResult["refund_line_items"] = {};
	JsonResult["refund_line_items"]["rows"]=[];
	JsonResult["transactions"] = {};
	JsonResult["transactions"]["rows"]=[];*/

	var props = Object.keys(inputsShopify);
	var nameParent;
	if(props.length>0){
		nameParent = props[0]; 
	}
	JsonResult[nameParent] = {};
	JsonResult[nameParent]["rows"]=[];


	getRowsShopify(inputsShopify[nameParent],JsonResult,nameParent); //namesDatasetChild

	utils.WriteFileTxt(JSON.stringify(JsonResult));

	/*for(var property in JsonResult){
		switch (property) {
			case 'orders'				: datasetId = datasetsShopify.datasetOrderId.id; break;
			case 'discount_codes' 		: datasetId = datasetsShopify.datasetOrderDiscountCodeId.id; break;
			case 'note_attributes'		: datasetId = datasetsShopify.datasetOrderNoteAttributeId.id; break;
			case 'tax_lines'			: datasetId = datasetsShopify.datasetOrderTaxLineId.id; break;
			case 'line_items'			: datasetId = datasetsShopify.datasetOrderLineItemId.id; break;
			case 'properties'			: datasetId = datasetsShopify.datasetOrderLineItemPropertiesId.id; break;
			case 'shipping_lines'		: datasetId = datasetsShopify.datasetOrderShippingLineId.id; break;
			case 'fulfillments'			: datasetId = datasetsShopify.datasetOrderFulfillmentId.id; break;
			case 'refunds'				: datasetId = datasetsShopify.datasetOrderRefundsId.id; break;
			case 'refund_line_items'	: datasetId = datasetsShopify.datasetOrderRefundsLineItemId.id; break;
			case 'transactions'			: datasetId = datasetsShopify.datasetOrderRefundsTransactionId.id; break;
		}
		NumetricCon.updateRowsDataSetNumetric(datasetId,JsonResult[property]);
	}*/
}

//METODO FINAL QUE USARE PARA CARGAR CUALQUIER DATA A SU DATASET CORRESPONDIENTE EN NUMETRIC
var sendRowsShopifyToNumetric = function(inputsShopify){
	var datasetId = "";
	var JsonResult = {};
	var props = Object.keys(inputsShopify);
	var nameParent;
	if(props.length>0){
		nameParent = props[0]; 
	}
	JsonResult[nameParent] = {};
	JsonResult[nameParent]["rows"]=[];

	getRowsShopify(inputsShopify[nameParent],JsonResult,nameParent); 

	for(var property in JsonResult){
		datasetId = datasetsShopify[property].id;
		NumetricCon.updateRowsDataSetNumetric(datasetId,JsonResult[property]);
	}
}


module.exports ={
NumetricShopifyFormat : NumetricShopifyFormat,
getRowsShopifyEvent : getRowsShopifyEvent,
getRowsShopifyCustomCollection : getRowsShopifyCustomCollection,
getRowsShopifyComment : getRowsShopifyComment,
getRowsShopifyProduct : getRowsShopifyProduct,
getRowsShopifySmartCollection : getRowsShopifySmartCollection,
getRowsShopifyCustomer : getRowsShopifyCustomer,
getRowsShopifyTransaction : getRowsShopifyTransaction,
getRowsShopifyArticle : getRowsShopifyArticle,
getRowsShopifyOrder : getRowsShopifyOrder
}