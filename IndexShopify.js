'use strict'
const NumetricCon = require("./DataConnectorApi/NumetricDataConnectorApi/NumetricDataConnectorApi")
const ShopifyCon = require("./DataConnectorLogic/ShopifyDataConnectorLogic")
const numetricDataConnectorLogic = require("./DataConnectorLogic/NumetricDataConnectorLogic")
const ShopifyData = require("./DataConnectorApi/ShopifyDataConnectorApi/ShopifyDataDataConnectorApi")
const config = require("./Config/Config")

var conf = new config();


var lastUpdated = {
  created_at_min : conf.parameters().initialDateTimeShopify,
  timezone : 'GMT-11:00'
}


ShopifyData.getCustomers(lastUpdated,function(resultCustomer){ 
		if(resultCustomer.Result.Success){
		
		var datasetShopify = ShopifyCon.NumetricShopifyFormat(resultCustomer.Result.Data,"id","customers");
		var lstIds = [];
		var datos = resultCustomer.Result.Data;

		numetricDataConnectorLogic.verifyCreateDatasetNumetric('customers',datasetShopify.DataSetList).then(resultCustomer=>
		{
		resultCustomer.Result.customers = {};
		resultCustomer.Result.customers.id =  resultCustomer.Result.Id; 
			
			numetricDataConnectorLogic.verifyCreateDatasetNumetric('customers_addresses',datasetShopify.DataSetList).then(resultDefaultAddres=>
			{
				resultCustomer.Result.customers_addresses = {};
				resultCustomer.Result.customers_addresses.id= resultDefaultAddres.Result.Id; 
				numetricDataConnectorLogic.verifyCreateDatasetNumetric('customers_default_address',datasetShopify.DataSetList).then(resultAdress=>
				{
					resultCustomer.Result.customers_default_address = {};
					resultCustomer.Result.customers_default_address.id = resultAdress.Result.Id; 
					resultCustomer.Result.Data = datos;
					ShopifyCon.sendRowsShopifyToNumetric(resultCustomer.Result);
				});
			});
			
		});   
		}
});


