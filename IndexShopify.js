'use strict'
const NumetricCon = require("./DataConnectorApi/NumetricDataConnectorApi/NumetricDataConnectorApi")
const ShopifyCon = require("./DataConnectorLogic/ShopifyDataConnectorLogic")
const numetricDataConnectorLogic = require("./DataConnectorLogic/NumetricDataConnectorLogic")
const ShopifyData = require("./DataConnectorApi/ShopifyDataConnectorApi/ShopifyDataDataConnectorApi")
const inputsMixPanel = require("./SampleData/exampleDataMixPanel")
const inputsShopify = require("./SampleData/exampleDataShopify")
const config = require("./Config/Config")
//borrar luego esta constante
const utils = require("./Helper/Util")
var async = require("async");
var forEach = require('async-foreach').forEach;

//const datasetsShopify = require("./Model/datasetsShopify")

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
		
		numetricDataConnectorLogic.verifyCreateDatasetNumetric('customers',datasetShopify.DataSetList[0]).then(resultCustomer=>
		{
		
		resultCustomer.Result.datasetCustomerId = resultCustomer.Response.Id; 
		
			
			numetricDataConnectorLogic.verifyCreateDatasetNumetric('customers_addresses',datasetShopify.DataSetList[1]).then(resultDefaultAddres=>
			{
				resultCustomer.Result.datasetCustomerDefaultAddressId = resultDefaultAddres.Response.Id; 
				numetricDataConnectorLogic.verifyCreateDatasetNumetric('customers_default_address',datasetShopify.DataSetList[2]).then(resultAdress=>
				{
					resultCustomer.Result.datasetCustomerAddressId = resultAdress.Response.Id; 
					resultCustomer.Result.Data = datos;
					ShopifyCon.getRowsShopifyCustomer(resultCustomer.Result);
					
				});
			});
			
			
			
		});   
		}
});


/*
ShopifyData.getTimeZone(function(result){	
		  console.log(result);
});
*/


/*
NumetricCon.getDataSetNumetric().then(result=>{ 
 utils.WriteFileTxt(JSON.stringify(result));
})
*/







/*
MixPanelData.getEvents(lastUpdated,function(result){
			console.log(result);
		});
*/


//delete rows
//NumetricCon.deleteRowsDataSetNumetric("374bdb59-c2ce-49c6-b181-bfd8f6a36c8c",{rows:[1,2,3,4,5,6,7,8,9,10,11,12,13,14],});


//var iMp = new inputsMixPanel()
//grabar datos en dataset mix panel
//updateRowsMixPanel(iMp.datamp);
//updateRowsMixPanel(iMp.inputMixPanel);

//andy
var iS = new inputsShopify(); 

//Grabar datos en datasetEvent
//getRowsShopifyEvent(iS.inputEvent.events);
//Grabar datos en datasetCustomCollection
//getRowsShopifyCustomCollection(iS.inputCustomCollection.custom_collections);
//Grabar datos en datasetComment
//getRowsShopifyComment(iS.inputComment.comments);
//Grabar datos en datasetProduct
//getRowsShopifyProduct(iS.inputProduct.products);

ShopifyCon.getRowsShopifyOrder(iS.inputOrder);

//andy
//ShopifyCon.getRowsShopifyCustomer(iS.inputCustomer);

//generar data set
//MixPanel
/*
var conf = new config();
var finalFormatMixPanel = NumetricMixPanelFormat(inputsMixPanel.inputMixPanel)
var datasetmixpanel = utils.GenerateDataSetsNumetricFromMixPanel(finalFormatMixPanel);
//console.log(datasetmixpanel.DataSetList[0])
generateDataSetNumetric(datasetmixpanel.DataSetList[0]);
*/
//Shopify
//var datasetshopify = ShopifyCon.NumetricShopifyFormat(iS.inputOrder.orders[0],"id","orders");
//var datasetshopify = ShopifyCon.NumetricShopifyFormat(iS.inputCustomer.customers[0],"id","customers");
//var datasetshopify = ShopifyCon.NumetricShopifyFormat(iS.inputCustomer,"id","customers");
//utils.WriteFileTxt(JSON.stringify(datasetshopify));
//console.log(datasetshopify);
//NumetricCon.generateDataSetNumetric(datasetsShopify.datasetCustomer).then(result=>{console.log(result); });
//NumetricCon.getDataSetNumetric().then(result=>{console.log(result); });
//MixPanelCon.generateDataSetMixPanel();
//MixPanelCon.testPreserveValue();
