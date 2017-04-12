'use strict'
const NumetricCon = require("../DataConnectorApi/NumetricDataConnectorApi/NumetricDataConnectorApi")
const ShopifyCon = require("../DataConnectorLogic/ShopifyDataConnectorLogic")
const numetricDataConnectorLogic = require("../DataConnectorLogic/NumetricDataConnectorLogic")
const ShopifyData = require("../DataConnectorApi/ShopifyDataConnectorApi/ShopifyDataDataConnectorApi")
const config = require("../Config/Config")
const utils = require("../Helper/Util")
const promiseRetry = require('promise-retry')
var nconf = require('nconf');
nconf.use('file', { file: '../ConfigDate/DateTimeLastSync.json' });
var conf = new config();
var datetime = require('node-datetime');


var options = {
  retries: conf.parameters().retriesCount
}


var syncDataRetry = function syncDataRetry(lastUpdated) 
{	
	console.log("syncDataRetry");

	promiseRetry(options,function (retry, number) 
	{
		console.log('attempt number', number);

		return syncData(lastUpdated)
		.catch(err=>{
			//aqui grabas
			console.log(err);
			retry(err);
		});
	})
	.then(function (value) 
	{
		console.log('syncDataRetry completed');
		// save datetime
		nconf.load();
		
		var dt = datetime.create();
		var fomratted = dt.format('m/d/Y H:M:S');
		console.log(fomratted);
		nconf.set('lastUpdateShopify',fomratted);
		
		nconf.save(function (err) 
		{
			if (err) 
			{
				console.error(err.message);
				return;
			}
			console.log('Shopify last updated saved successfully.');
		});
	}, function (err) 
	{
		//aqui grabas si siguio el error despues de los reintentos
		console.log(err);
	});
}

var syncData = function syncData(lastUpdated) 
{
	console.log(lastUpdated);
	
	console.log("syncData");
	
    var resultEvent = {};
    resultEvent.Result = {}
    resultEvent.Result.Success = false;

    return NumetricCon.getDataSetNumetric().then(currentListDataset=>{

		 return syncDataCustomer(lastUpdated,currentListDataset).then(resultCustome=>
		 {
			console.log("syncDataCustomer Completed");
			
			return syncDataEvents(lastUpdated,currentListDataset).then(resultEvents=>
			{
				console.log("syncDataEvents Completed");
				
					return syncDataComments(lastUpdated,currentListDataset).then(resultComments=>
					{
						console.log("syncDataComments Completed");
						return syncDataProducts(lastUpdated,currentListDataset).then(resultProducts=>
						{
							console.log("syncDataProducts Completed");
							return syncDataCustomCollections(lastUpdated,currentListDataset).then(resultCustomCollections=>
							{
								console.log("syncDataCustomCollections Completed");
								return syncDataOrder(lastUpdated,currentListDataset).then(resultOrder=>
								{
									console.log("syncDataOrder Completed");
									return resultEvent.Result.Success= true;
								});
							});     
						});
					});
				
		   });
		});
	});
}


var syncDataCustomer = function syncDataCustomer(lastUpdated,currentListDataset) 
{
	console.log("syncDataCustomer Init");
	
	var resultEvent = {};
    resultEvent.Result = {}
    resultEvent.Result.Success = false;

	return 	ShopifyData.getCustomers(lastUpdated).then(resultCustomer=>
	{ 		
			
		if(resultCustomer.Result.Success)
		{					
			if(resultCustomer.Result.Data.customers.length>0)
			{		
				var datasetShopify = ShopifyCon.NumetricShopifyFormat(resultCustomer.Result.Data,"id","customers");
				var datos = resultCustomer.Result.Data;
				var datasetNames =['customers','customers_addresses','customers_default_address'];

				return numetricDataConnectorLogic.verifyCreateManyDatasetNumetric(datasetNames,currentListDataset,datasetShopify.DataSetList).then(resultVerify=>
				{
					for (var i = 0; i < resultVerify.length; i++ ) {
						if(resultVerify[i].Result.Success){
							resultCustomer.Result[resultVerify[i].Result.datasetName] = {};
							resultCustomer.Result[resultVerify[i].Result.datasetName].id=resultVerify[i].Result.Id;
						}
					}
					resultCustomer.Result.Data = datos;
					return ShopifyCon.sendRowsShopifyToNumetric(resultCustomer.Result).then(results=>
					{
						return results;
					});

				});
			}
			else{
				resultEvent.Result.Success = true;
				return resultEvent;
			}
		}
	});
}

var syncDataEvents = function syncDataEvents(lastUpdated,currentListDataset) 
{
	console.log("syncDataEvents Init");
	
	var resultEvent = {};
    resultEvent.Result = {}
    resultEvent.Result.Success = false;
	
	return 	ShopifyData.getEvents(lastUpdated).then(resultEvents=>	
	{ 
		if(resultEvents.Result.Success)
		{			
			if(resultEvents.Result.Data.events.length>0)
			{
				var datasetShopify = ShopifyCon.NumetricShopifyFormat(resultEvents.Result.Data,"id","events");
				var datos = resultEvents.Result.Data;
				var datasetNames =['events'];
				return numetricDataConnectorLogic.verifyCreateManyDatasetNumetric(datasetNames,currentListDataset,datasetShopify.DataSetList).then(resultVerify=>
				{
					for (var i = 0; i < resultVerify.length; i++ ) {
						if(resultVerify[i].Result.Success){
							resultEvents.Result[resultVerify[i].Result.datasetName] = {};
							resultEvents.Result[resultVerify[i].Result.datasetName].id=resultVerify[i].Result.Id;
						}
					}
					resultEvents.Result.Data = datos;
					return ShopifyCon.sendRowsShopifyToNumetric(resultEvents.Result).then(results=>
					{
						return results;
					});

				}); 
			} 
		}
		else
		{
				resultEvent.Result.Success = true;
				return resultEvent;
		}
	})
	
}

var syncDataComments = function syncDataComments(lastUpdated,currentListDataset) 
{
	console.log("syncDataComments Init");

	var resultEvent = {};
    resultEvent.Result = {}
    resultEvent.Result.Success = false;
	
	return 	ShopifyData.getComments(lastUpdated).then(resultComments=>		
	{ 
		if(resultComments.Result.Success)
		{			
			if(resultComments.Result.Data.comments.length>0)
			{
				var datasetShopify = ShopifyCon.NumetricShopifyFormat(resultComments.Result.Data,"id","comments");
				var datos = resultComments.Result.Data;
				var datasetNames =['comments'];
				return numetricDataConnectorLogic.verifyCreateManyDatasetNumetric(datasetNames,currentListDataset,datasetShopify.DataSetList).then(resultVerify=>
				{
					for (var i = 0; i < resultVerify.length; i++ ) {
						if(resultVerify[i].Result.Success){
							resultComments.Result[resultVerify[i].Result.datasetName] = {};
							resultComments.Result[resultVerify[i].Result.datasetName].id=resultVerify[i].Result.Id;
						}
					}
					resultComments.Result.Data = datos;
					return ShopifyCon.sendRowsShopifyToNumetric(resultComments.Result).then(results=>
					{
						return results;
					});

				});  
			} 
		}
		else
		{
				resultEvent.Result.Success = true;
				return resultEvent;
		}
	})
}

var syncDataProducts = function syncDataProducts(lastUpdated,currentListDataset) 
{
	console.log("syncDataProducts Init");
	
	var resultEvent = {};
    resultEvent.Result = {}
    resultEvent.Result.Success = false;
	
	return 	ShopifyData.getProducts(lastUpdated).then(resultProducts=>																																																									//{
	{ 
		if(resultProducts.Result.Success)
		{	
			if(resultProducts.Result.Data.products.length>0)
			{
				var datasetShopify = ShopifyCon.NumetricShopifyFormat(resultProducts.Result.Data,"id","products");
				var datos = resultProducts.Result.Data;
				var datasetNames =['products'];
				return numetricDataConnectorLogic.verifyCreateManyDatasetNumetric(datasetNames,currentListDataset,datasetShopify.DataSetList).then(resultVerify=>
				{
					for (var i = 0; i < resultVerify.length; i++ ) {
						if(resultVerify[i].Result.Success){
							resultProducts.Result[resultVerify[i].Result.datasetName] = {};
							resultProducts.Result[resultVerify[i].Result.datasetName].id=resultVerify[i].Result.Id;
						}
					}
					resultProducts.Result.Data = datos;
					return ShopifyCon.sendRowsShopifyToNumetric(resultProducts.Result).then(results=>
					{
						return results;
					});

				});  
			}  
		}
		else
		{
				resultEvent.Result.Success = true;
				return resultEvent;
		}
	})	
	
}

var syncDataCustomCollections = function syncDataCustomCollections(lastUpdated,currentListDataset) 
{
	console.log("syncDataCustomCollections Init");
	
	var resultEvent = {};
    resultEvent.Result = {}
    resultEvent.Result.Success = false;
	
	return 	ShopifyData.getCustomCollections(lastUpdated).then(resultCustomCollection=>		
	{ 
		if(resultCustomCollection.Result.Success)
		{						
			if(resultCustomCollection.Result.Data.custom_Collection.length>0)
			{
				var datasetShopify = ShopifyCon.NumetricShopifyFormat(resultCustomCollection.Result.Data,"id","custom_Collection");
				var datos = resultCustomCollection.Result.Data;
				var datasetNames =['custom_Collection'];
				return numetricDataConnectorLogic.verifyCreateManyDatasetNumetric(datasetNames,currentListDataset,datasetShopify.DataSetList).then(resultVerify=>
				{
					for (var i = 0; i < resultVerify.length; i++ ) {
						if(resultVerify[i].Result.Success){
							resultCustomCollection.Result[resultVerify[i].Result.datasetName] = {};
							resultCustomCollection.Result[resultVerify[i].Result.datasetName].id=resultVerify[i].Result.Id;
						}
					}
					resultCustomCollection.Result.Data = datos;
					return ShopifyCon.sendRowsShopifyToNumetric(resultCustomCollection.Result).then(results=>
					{
						return results;
					});

				});    
			}
		}
		else
		{
				resultEvent.Result.Success = true;
				return resultEvent;
		}
		
	});
}

var syncDataOrder = function syncDataOrder(lastUpdated,currentListDataset) 
{
	console.log("syncDataOrder Init");
	
	var resultEvent = {};
    resultEvent.Result = {}
    resultEvent.Result.Success = false;
	
	return 	ShopifyData.getOrders(lastUpdated).then(resultOrder=>	
	{ 
		if(resultOrder.Result.Success)
		{
			if(resultOrder.Result.Data.orders.length>0)
			{	
				utils.WriteFileTxt("\r\n");
				utils.WriteFileTxt(JSON.stringify(resultOrder));
				utils.WriteFileTxt("\r\n");
			
				var datasetShopify = ShopifyCon.NumetricShopifyFormat(resultOrder.Result.Data,"id","orders");
				var datos = resultOrder.Result.Data;	
				var datasetNames =['orders',
				'orders_billing_address',
				'orders_shipping_address',
				'orders_discount_codes',   
				'orders_note_attributes',
				'orders_tax_lines',
				'orders_line_items',
				'orders_line_items_properties',
				'orders_shipping_lines',
				'orders_fulfillments',
				'orders_fulfillments_receipt',
				'orders_refunds',
				'orders_refunds_line_items',
				'orders_refunds_line_items_line_item',
				'orders_refunds_line_items_line_item_properties',
				'orders_refunds_line_items_line_item_tax_lines',
				'orders_refunds_transactions',
				'orders_refunds_order_adjustments',
				'orders_refunds_transactions_receipt',
				'orders_payment_details',
				'orders_customer',
				'orders_customer_default_address'
				];
				return numetricDataConnectorLogic.verifyCreateManyDatasetNumetric(datasetNames,currentListDataset,datasetShopify.DataSetList).then(resultVerify=>
				{
					for (var i = 0; i < resultVerify.length; i++ ) {
						if(resultVerify[i].Result.Success){
							resultOrder.Result[resultVerify[i].Result.datasetName] = {};
							resultOrder.Result[resultVerify[i].Result.datasetName].id=resultVerify[i].Result.Id;
						}
					}
					resultOrder.Result.Data = datos;
					return ShopifyCon.sendRowsShopifyToNumetric(resultOrder.Result).then(results=>
					{
						return results;
					});

				}); 
					
			}
			else
			{
				resultEvent.Result.Success = true;
				return resultEvent;
			}
		}
	});
}



module.exports = 
{
    syncDataRetry : syncDataRetry
};


/*
NO FUNCIONA



//TODO:Request path contains unescaped characters
ShopifyData.getTransactions(lastUpdated,function(resultTransactions)
{ 
	if(resultTransactions.Result.Success)
	{						
		var datasetShopify = ShopifyCon.NumetricShopifyFormat(resultTransactions.Result.Data,"id","transactions");
		var datos = resultTransactions.Result.Data;
		
		numetricDataConnectorLogic.verifyCreateDatasetNumetric('transactions',datasetShopify.DataSetList).then(resultTransactionsVerify=>
		{
			resultTransactions.Result.transactions = {};
			resultTransactions.Result.transactions.id =  resultTransactionsVerify.Result.Id; 
			resultTransactions.Result.Data = datos;			
		
			ShopifyCon.sendRowsShopifyToNumetric(resultTransactions.Result);				
		});   
	}
});


//TODO: "SELF_SIGNED_CERT_IN_CHAIN","message":"self signed certificate in certificate chain" ,"hostname":"alshopping.myshopify.com","method":"GET","path":"/admin/smart_collections.json?created_at_min=2017-01-07T03%3A52%3A48.000Z"
ShopifyData.getSmartCollections(lastUpdated,function(resultSmartCollection)
{ 
		if(resultSmartCollection.Result.Success)
		{						
			var datasetShopify = ShopifyCon.NumetricShopifyFormat(resultSmartCollection.Result.Data,"id","smart_Collection");
			var datos = resultSmartCollection.Result.Data;
			
			numetricDataConnectorLogic.verifyCreateDatasetNumetric('smart_Collection',datasetShopify.DataSetList).then(resultSmartCollectionVerify=>
			{
				resultSmartCollection.Result.smart_Collection = {};
				resultSmartCollection.Result.smart_Collection.id =  resultSmartCollectionVerify.Result.Id; 
				resultSmartCollection.Result.Data = datos;			
			
				ShopifyCon.sendRowsShopifyToNumetric(resultSmartCollection.Result);				
			});   
		}
});

//TODO: {"code":"SELF_SIGNED_CERT_IN_CHAIN","message":"self signed certificate in certificate chain","hostname":"alshopping.myshopify.com","method":"GET","path":"/admin/blogs.json?created_at_min=2017-01-07T03%3A52%3A48.000Z"}
ShopifyData.getArticles(lastUpdated,function(resultArticles)
{ 
	if(resultArticles.Result.Success)
	{						
		var datasetShopify = ShopifyCon.NumetricShopifyFormat(resultArticles.Result.Data,"id","articles");
		var datos = resultArticles.Result.Data;
		
		numetricDataConnectorLogic.verifyCreateDatasetNumetric('articles',datasetShopify.DataSetList).then(resultArticlesVerify=>
		{
			resultArticles.Result.articles = {};
			resultArticles.Result.articles.id =  resultArticlesVerify.Result.Id; 
			resultArticles.Result.Data = datos;			
		
			ShopifyCon.sendRowsShopifyToNumetric(resultArticles.Result);				
		});   
	}
});














	
*/
