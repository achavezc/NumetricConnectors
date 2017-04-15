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
	promiseRetry(options,function (retry, number) 
	{
		console.log('Started Sync Shopify Data attempt number: '+ number);
		
		return syncData(lastUpdated)
		.catch(err=>
		{
			console.log('Error Sync Shopify Data: '+ err);				
		});
	})
	.then(function (value) 
	{
		console.log('Completed Sync Shopify Data');
				
		// save Last DateTime Sync
		
		nconf.load();
		
		var dt = datetime.create();
		var fomratted = dt.format('m/d/Y H:M:S');
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
		console.log('Error Sync Shopify Data:'+ err);
	});
}

var syncData = function syncData(lastUpdated) 
{	
	var lstDataSet = []
    var resultEvent = {};
    resultEvent.Result = {}
    resultEvent.Result.Success = false;

    return NumetricCon.getDataSetNumetric().then(currentListDataset=>
	{	
		var lstDataSet = currentListDataset
		 return syncDataCustomer(lastUpdated,lstDataSet).then(resultCustome=>
		 {
			return syncDataEvents(lastUpdated,lstDataSet).then(resultEvents=>
			{
				//console.log("Started Sync Shopify Events Data");
						
				return syncDataComments(lastUpdated,lstDataSet).then(resultComments=>
				{
					//console.log("Completed Sync Shopify Events Data");
					
					return syncDataProducts(lastUpdated,lstDataSet).then(resultProducts=>
					{
						return syncDataBlogs(lastUpdated,lstDataSet).then(resultBlogs=>
						{							
							//console.log("syncDataBlogs Completed");			
							
							return syncDataArticles(lastUpdated,lstDataSet).then(resultArticles=>
							{			
								//console.log("syncDataArticles Completed");	
								return syncDataSmartCollections(lastUpdated,lstDataSet).then(resultSmartCollections=>
								{
									return syncDataCustomCollections(lastUpdated,lstDataSet).then(resultCustomCollections=>
									{
										 return syncDataTransactions(lastUpdated,lstDataSet).then(resultTransactions=>
										 {
											return syncDataOrder(lastUpdated,lstDataSet).then(resultOrder=>
											{												
												return resultEvent.Result.Success= true;
											});
										 });	
										
										
										// utils.WriteFileTxt("\r\n");
										// utils.WriteFileTxt("Before syncDataTransactions");
										// utils.WriteFileTxt("\r\n");
																	
										// return syncDataTransactions(lastUpdated,lstDataSet).then(resultTransactions=>
										// {				
											// utils.WriteFileTxt("\r\n");
											// utils.WriteFileTxt("After syncDataTransactions");
											// utils.WriteFileTxt("\r\n");
										
											
										// });
									});
								});
							});
						});
					});     
				});
		   });
		});
	});
}

var syncDataBlogs = function syncDataBlogs(lastUpdated,currentListDataset) 
{
	console.log("Started Sync Shopify Blog Data");
		
	var resultEvent = {};
    resultEvent.Result = {}
    resultEvent.Result.Success = false;
	
	return 	ShopifyData.getBlogs(lastUpdated).then(resultBlogs=>	
	{ 
		if(resultBlogs.Result.Success)
		{			
			if(resultBlogs.Result.Data.blogs.length>0)
			{
				var datasetShopify = ShopifyCon.NumetricShopifyFormat(resultBlogs.Result.Data,"id","blogs");
				var datos = resultBlogs.Result.Data;
				var datasetNames =['blogs'];

				return numetricDataConnectorLogic.verifyCreateManyDatasetNumetric(datasetNames,currentListDataset,datasetShopify.DataSetList).then(resultVerify=>
				{
					for (var i = 0; i < resultVerify.length; i++ ) {
						if(resultVerify[i].Result.Success){
							resultBlogs.Result[resultVerify[i].Result.datasetName] = {};
							resultBlogs.Result[resultVerify[i].Result.datasetName].id=resultVerify[i].Result.Id;
						}
					}
					resultBlogs.Result.Data = datos;
					
					console.log("Shopify Blog Data to Sync: "+ resultBlogs.Result.Data.blogs.length);
					
					return ShopifyCon.sendRowsShopifyToNumetric(resultBlogs.Result).then(results=>
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

var syncDataCustomer = function syncDataCustomer(lastUpdated,currentListDataset) 
{
	console.log("Started Sync Shopify Customer Data");	
	
	var resultEvent = {};
    resultEvent.Result = {}
    resultEvent.Result.Success = false;

	return 	ShopifyData.getCustomers(lastUpdated).then(resultCustomer=>
	{ 				
		if(resultCustomer.Result.Success)
		{	
			console.log("Shopify Customer Data to Sync: "+ resultCustomer.Result.Data.customers.length);
			
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
						console.log("Completed Sync Shopify Customer Data");
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


var syncDataSmartCollections = function syncDataSmartCollections(lastUpdated,currentListDataset) 
{
	console.log("Started Sync Shopify Smart Collections Data");

	var resultEvent = {};
    resultEvent.Result = {}
    resultEvent.Result.Success = false;
	
	return 	ShopifyData.getSmartCollections(lastUpdated).then(resultSmartCollection=>		
	{ 
		if(resultSmartCollection.Result.Success)
		{					
			console.log("Shopify Smart Collections Data to Sync: "+ resultSmartCollection.Result.Data.smart_collection.length);
			
			if(resultSmartCollection.Result.Data.smart_collection.length>0)
			{			
				var datasetShopify = ShopifyCon.NumetricShopifyFormat(resultSmartCollection.Result.Data,"id","smart_collection");
				var datos = resultSmartCollection.Result.Data;
				var datasetNames =['smart_collection'];				
				
				return numetricDataConnectorLogic.verifyCreateManyDatasetNumetric(datasetNames,currentListDataset,datasetShopify.DataSetList).then(resultVerify=>
				{
					for (var i = 0; i < resultVerify.length; i++ ) {
						if(resultVerify[i].Result.Success){
							resultSmartCollection.Result[resultVerify[i].Result.datasetName] = {};
							resultSmartCollection.Result[resultVerify[i].Result.datasetName].id=resultVerify[i].Result.Id;
						}
					}
					resultSmartCollection.Result.Data = datos;
					return ShopifyCon.sendRowsShopifyToNumetric(resultSmartCollection.Result).then(results=>
					{
						console.log("Completed Sync Shopify Smart Collections Data");
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



var syncDataEvents = function syncDataEvents(lastUpdated,currentListDataset) 
{	
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


var syncDataArticles = function syncDataArticles(lastUpdated,currentListDataset) 
{
	var resultEvent = {};
    resultEvent.Result = {}
    resultEvent.Result.Success = false;
	
	return 	ShopifyData.getArticles(lastUpdated).then(resultArticles=>																																																									//{
	{ 
		if(resultArticles.Result.Success)
		{	
			if(resultArticles.Result.Data.articles.length>0)
			{
				var datasetShopify = ShopifyCon.NumetricShopifyFormat(resultArticles.Result.Data,"id","articles");
				var datos = resultArticles.Result.Data;
				var datasetNames =['articles'];
				return numetricDataConnectorLogic.verifyCreateManyDatasetNumetric(datasetNames,currentListDataset,datasetShopify.DataSetList).then(resultVerify=>
				{
					for (var i = 0; i < resultVerify.length; i++ ) {
						if(resultVerify[i].Result.Success){
							resultArticles.Result[resultVerify[i].Result.datasetName] = {};
							resultArticles.Result[resultVerify[i].Result.datasetName].id=resultVerify[i].Result.Id;
						}
					}
					resultArticles.Result.Data = datos;
					return ShopifyCon.sendRowsShopifyToNumetric(resultArticles.Result).then(results=>
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
	
	console.log("Started Sync Shopify Custom Collections Data");
	
	var resultEvent = {};
    resultEvent.Result = {}
    resultEvent.Result.Success = false;
	
	return 	ShopifyData.getCustomCollections(lastUpdated).then(resultCustomCollection=>		
	{ 
		if(resultCustomCollection.Result.Success)
		{		
		
			console.log("Shopify Smart Collections Data to Sync: "+ resultCustomCollection.Result.Data.custom_collection.length);
			
			if(resultCustomCollection.Result.Data.custom_collection.length>0)
			{
				var datasetShopify = ShopifyCon.NumetricShopifyFormat(resultCustomCollection.Result.Data,"id","custom_collection");
				var datos = resultCustomCollection.Result.Data;
				var datasetNames =['custom_collection'];
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
						console.log("Completed Sync Shopify Custom Collections Data");
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
	
	var resultEvent = {};
    resultEvent.Result = {}
    resultEvent.Result.Success = false;
	
	return 	ShopifyData.getOrders(lastUpdated).then(resultOrder=>	
	{ 
		if(resultOrder.Result.Success)
		{
			if(resultOrder.Result.Data.orders.length>0)
			{
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


var syncDataTransactions = function syncDataTransactions(lastUpdated,currentListDataset) 
{	
	var resultEvent = {};
    resultEvent.Result = {}
    resultEvent.Result.Success = false;
	
	return 	ShopifyData.getTransactions(lastUpdated).then(resultTransactions=>									
	{ 
		if(resultTransactions.Result.Success)
		{	
			if(resultTransactions.Result.Data.transactions.length>0)
			{			
				var datasetShopify = ShopifyCon.NumetricShopifyFormat(resultTransactions.Result.Data,"id","transactions");						
				
				var datos = resultTransactions.Result.Data;
								
				
				var datasetNames =['transactions'];
				return numetricDataConnectorLogic.verifyCreateManyDatasetNumetric(datasetNames,currentListDataset,datasetShopify.DataSetList).then(resultVerify=>
				{
					for (var i = 0; i < resultVerify.length; i++ ) 
					{
						if(resultVerify[i].Result.Success)
						{
							resultTransactions.Result[resultVerify[i].Result.datasetName] = {};
							resultTransactions.Result[resultVerify[i].Result.datasetName].id=resultVerify[i].Result.Id;							
						}
					}
				
					resultTransactions.Result.Data = datos;
					return ShopifyCon.sendRowsShopifyToNumetric(resultTransactions.Result).then(results=>
					{
						console.log("Completed Sync Shopify Transactions Data");
						return results;
					});
					
				});  
			}  
		}
		else
		{
				utils.WriteFileTxt("resultTransactions.Result.Success=false");
				resultEvent.Result.Success = true;
				return resultEvent;
				
		}
	})	
}



module.exports = 
{
    syncDataRetry : syncDataRetry,
	syncDataCustomer: syncDataCustomer,
	syncDataTransactions: syncDataTransactions
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
