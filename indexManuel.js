'use strict'
const NumetricCon = require("./DataConnectorApi/NumetricDataConnectorApi/NumetricDataConnectorApi")
const ShopifyCon = require("./DataConnectorLogic/ShopifyDataConnectorLogic")
const ShopifyData = require("./DataConnectorApi/ShopifyDataConnectorApi/ShopifyDataDataConnectorApi")
const datasetsShopify = require("./Model/datasetsShopify")
const config = require("./Config/Config")

var conf = new config();


var lastUpdated = {
  created_at_min : conf.parameters().initialDateTimeShopify,
  timezone : 'GMT-11:00'
}

ShopifyData.getOrders(lastUpdated,function(resultOrder)
{ 
 if(resultOrder.Result.Success)
 {  
  var datasetShopify = ShopifyCon.NumetricShopifyFormat(resultOrder.Result.Data,"id","orders");
  var datos = resultOrder.Result.Data;
  
  NumetricCon.generateDataSetNumetric(datasetShopify.DataSetList[0]).then(resultOrder=>
  { 
   //resultOrder.Result.datasetOrderId= {};
   datasetsShopify.datasetOrderId = {};
   //resultOrder.Result.datasetOrderId.id = resultOrder.Response.id; 
   datasetsShopify.datasetOrderId["id"] = resultOrder.Response.id;
  
   resultOrder.Result.Data = datos; 
   
   ShopifyCon.getRowsShopifyOrder(resultOrder.Result.Data);
     
  });
   
 }
});