'use strict';
const NumetricCon = require("../DataConnectorApi/NumetricDataConnectorApi/NumetricDataConnectorApi");
const ShopifyCon = require("../DataConnectorLogic/ShopifyDataConnectorLogic");
const numetricDataConnectorLogic = require("../DataConnectorLogic/NumetricDataConnectorLogic");
const ShopifyData = require("../DataConnectorApi/ShopifyDataConnectorApi/ShopifyDataDataConnectorApi");
const config = require("../Config/Config");
const utils = require("../Helper/Util");
const promiseRetry = require('promise-retry');
var nconf = require('nconf');
nconf.use('file', { file: '../ConfigDate/DateTimeLastSync.json' });
var conf = new config();
var datetime = require('node-datetime');


var options = {
  retries: conf.parameters().retriesCount
};


var syncDataRetry = function syncDataRetry(lastUpdated) 
{	
	promiseRetry(options,function (retry, number) 
	{
		console.log('Started Sync Shopify Data attempt number: '+ number);
		
		return syncData(lastUpdated)
		.catch(err=>
		{
			console.log('Error Sync Shopify Data: '+ err);	
			utils.WriteFileTxt('Error Sync Shopify Data: '+ err);				
		});
	})
	.then(function ()
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
				console.error('Error Sync Shopify Data: '+err.message);
				utils.WriteFileTxt('Error Sync Shopify Data: '+ err.message);	
				return;
			}
			console.log('Shopify last updated saved successfully.');
			utils.WriteFileTxt('Shopify last updated saved successfully.');
			
		});
	}, function (err) 
	{		
		console.log('Error Sync Shopify Data:'+ err);
		utils.WriteFileTxt('Error Sync Shopify Data: '+ err);	
	});
};

var syncData = function syncData(lastUpdated)
{
    var resultEvent = {};
    resultEvent.Result = {};
    resultEvent.Result.Success = false;
					
    return NumetricCon.getDataSetNumetric().then(currentListDataset=>
	{	
		var lstDataSet = currentListDataset;
	
		return syncDataCustomer(lastUpdated,lstDataSet).then(resultCustome=>
		 {				
			 return syncDataComments(lastUpdated,lstDataSet).then(resultComments=>
			{					
				 return syncDataProducts(lastUpdated,lstDataSet).then(resultProducts=>
				 {
					 return syncDataBlogs(lastUpdated,lstDataSet).then(resultBlogs=>
					 {
						 return syncDataArticles(lastUpdated,lstDataSet).then(resultArticles=>
						 {			
							 return syncDataSmartCollections(lastUpdated,lstDataSet).then(resultSmartCollections=>
							 {
								 return syncDataCustomCollections(lastUpdated,lstDataSet).then(resultCustomCollections=>
								 {
									  return syncDataTransactions(lastUpdated,lstDataSet).then(resultTransactions=>
									  {											
										return syncDataEvents(lastUpdated,lstDataSet).then(resultEvents=>
											 {	
												return syncDataOrder(lastUpdated,lstDataSet).then(resultOrder=>
												{												
													return resultEvent.Result.Success= true;
												});
											 });	
										
									  });											
								 });
							 });
						 });
					 });
				 });     
			 });		   
		});
	});
};



var syncDataCustomer = function syncDataCustomer(lastUpdated,currentListDataset) 
{
	console.log("Started Sync Shopify Customer Data");	
	utils.WriteFileTxt('Started Sync Shopify Customer Data');
	
	var resultEvent = {};
    resultEvent.Result = {};
    resultEvent.Result.Success = false;

	return 	ShopifyData.getCustomers(lastUpdated).then(resultCustomer=>
	{ 				
		if(resultCustomer.Result.Success)
		{	
			console.log("Shopify Customer Data to Sync Row Count: "+ resultCustomer.Result.Data.customers.length);
			utils.WriteFileTxt("Shopify Customer Data to Sync Row Count: "+ resultCustomer.Result.Data.customers.length);
			
			if(resultCustomer.Result.Data.customers.length>0)
			{				
				var datos = resultCustomer.Result.Data;
				
				console.log("Shopify Customer Data to Sync:"+ JSON.stringify(datos));
				utils.WriteFileTxt("Shopify Customer Data to Sync:"+ JSON.stringify(datos));
								
				var datasetShopify = ShopifyCon.NumetricShopifyFormat(resultCustomer.Result.Data,"id","customers");
				
				//var datasetNames =['customers','customers_addresses','customers_default_address'];				
				
				var datasetNames =[];
				
				for(var i=0; i<datasetShopify.DataSetList.length; i++)
				{				
					datasetNames.push(datasetShopify.DataSetList[i].name);
				}
				
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
						utils.WriteFileTxt("Completed Sync Shopify Customer Data");
						console.log("Shopify Customer Data Synchronized:"+ JSON.stringify(resultCustomer.Result.Data));
						utils.WriteFileTxt("Shopify Customer Data Synchronized:"+ JSON.stringify(resultCustomer.Result.Data));
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
};


var syncDataSmartCollections = function syncDataSmartCollections(lastUpdated,currentListDataset) 
{
	console.log("Started Sync Shopify Smart Collections Data");
	utils.WriteFileTxt("Started Sync Shopify Smart Collections Data");

	var resultEvent = {};
    resultEvent.Result = {};
    resultEvent.Result.Success = false;
	
	return 	ShopifyData.getSmartCollections(lastUpdated).then(resultSmartCollection=>		
	{ 
		if(resultSmartCollection.Result.Success)
		{					
			console.log("Shopify Smart Collections Data to Sync Row Count: "+ resultSmartCollection.Result.Data.smart_collection.length);
			utils.WriteFileTxt("Shopify Smart Collections Data to Sync Row Count: "+ resultSmartCollection.Result.Data.smart_collection.length);
			
			if(resultSmartCollection.Result.Data.smart_collection.length>0)
			{					
				var datos = resultSmartCollection.Result.Data;
				
				console.log("Shopify Smart Collections Data to Sync:"+ JSON.stringify(datos));
				utils.WriteFileTxt("Shopify Smart Collections Data to Sync:"+ JSON.stringify(datos));
				
				var datasetShopify = ShopifyCon.NumetricShopifyFormat(resultSmartCollection.Result.Data,"id","smart_collection");
				
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
						utils.WriteFileTxt("Completed Sync Shopify Smart Collections Data");
						console.log("Shopify Smart Collections Data Synchronized:"+ JSON.stringify(resultSmartCollection.Result.Data));
						utils.WriteFileTxt("Shopify Smart Collections Data Synchronized:"+ JSON.stringify(resultSmartCollection.Result.Data));
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
};



var syncDataEvents = function syncDataEvents(lastUpdated,currentListDataset) 
{	
	console.log("Started Sync Shopify Events Data");
	utils.WriteFileTxt("Started Sync Shopify Events Data");

	var resultEvent = {};
    resultEvent.Result = {};
    resultEvent.Result.Success = false;
	
	return 	ShopifyData.getEvents(lastUpdated).then(resultEvents=>	
	{ 
		if(resultEvents.Result.Success)
		{	
			console.log("Shopify Events Data to Sync Row Count: "+ resultEvents.Result.Data.events.length);
			utils.WriteFileTxt("Shopify Events Data to Sync Row Count: "+ resultEvents.Result.Data.events.length);
			
			if(resultEvents.Result.Data.events.length>0)
			{				
				var datos = resultEvents.Result.Data;
				
				console.log("Shopify Events Data to Sync:"+ JSON.stringify(datos));
				utils.WriteFileTxt("Shopify Events Data to Sync:"+ JSON.stringify(datos));
			
				var datasetShopify = ShopifyCon.NumetricShopifyFormat(resultEvents.Result.Data,"id","events");
				
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
						console.log("Completed Sync Shopify Events Data");
						utils.WriteFileTxt("Completed Sync Shopify Events Data");
						console.log("Shopify Events Data Synchronized:"+ JSON.stringify(resultEvents.Result.Data));
						utils.WriteFileTxt("Shopify Events Data Synchronized:"+ JSON.stringify(resultEvents.Result.Data));
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
	
};

var syncDataComments = function syncDataComments(lastUpdated,currentListDataset) 
{
	console.log("Started Sync Shopify Comments Data");
	utils.WriteFileTxt("Started Sync Shopify Comments Data");
	
	var resultEvent = {};
    resultEvent.Result = {};
    resultEvent.Result.Success = false;
	
	return 	ShopifyData.getComments(lastUpdated).then(resultComments=>		
	{ 
		if(resultComments.Result.Success)
		{			
			console.log("Shopify Comments Data to Sync Row Count: "+ resultComments.Result.Data.comments.length);
			utils.WriteFileTxt("Shopify Comments Data to Sync Row Count: "+ resultComments.Result.Data.comments.length);
			
			if(resultComments.Result.Data.comments.length>0)
			{				
				var datos = resultComments.Result.Data;
				
				console.log("Shopify Comments Data to Sync:"+ JSON.stringify(datos));
				utils.WriteFileTxt("Shopify Comments Data to Sync:"+ JSON.stringify(datos));
			
				var datasetShopify = ShopifyCon.NumetricShopifyFormat(resultComments.Result.Data,"id","comments");
				
				var datasetNames =['comments'];
				
				return numetricDataConnectorLogic.verifyCreateManyDatasetNumetric(datasetNames,currentListDataset,datasetShopify.DataSetList).then(resultVerify=>
				{
					for (var i = 0; i < resultVerify.length; i++ ) 
					{
						if(resultVerify[i].Result.Success)
						{
							resultComments.Result[resultVerify[i].Result.datasetName] = {};
							resultComments.Result[resultVerify[i].Result.datasetName].id=resultVerify[i].Result.Id;
						}
					}
					resultComments.Result.Data = datos;
					
					return ShopifyCon.sendRowsShopifyToNumetric(resultComments.Result).then(results=>
					{
						console.log("Completed Sync Shopify Comments Data");
						utils.WriteFileTxt("Completed Sync Shopify Comments Data");
						console.log("Shopify Comments Data Synchronized:"+ JSON.stringify(resultComments.Result.Data));
						utils.WriteFileTxt("Shopify Comments Data Synchronized:"+ JSON.stringify(resultComments.Result.Data));
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
};

var syncDataBlogs = function syncDataBlogs(lastUpdated,currentListDataset) 
{
	console.log("Started Sync Shopify Blogs Data");
	utils.WriteFileTxt("Started Sync Shopify Blogs Data");
	
	var resultEvent = {};
    resultEvent.Result = {};
    resultEvent.Result.Success = false;
	
	return 	ShopifyData.getBlogs(lastUpdated).then(resultBlogs=>		
	{ 
		if(resultBlogs.Result.Success)
		{			
			console.log("Shopify Blogs Data to Sync Row Count: "+ resultBlogs.Result.Data.blogs.length);
			utils.WriteFileTxt("Shopify Blogs Data to Sync Row Count: "+ resultBlogs.Result.Data.blogs.length);
			
			if(resultBlogs.Result.Data.blogs.length>0)
			{				
				var datos = resultBlogs.Result.Data;
				
				console.log("Shopify Blogs Data to Sync:"+ JSON.stringify(datos));
				utils.WriteFileTxt("Shopify Blogs Data to Sync:"+ JSON.stringify(datos));
			
				var datasetShopify = ShopifyCon.NumetricShopifyFormat(resultBlogs.Result.Data,"id","blogs");
				
				var datasetNames =['blogs'];
				
				return numetricDataConnectorLogic.verifyCreateManyDatasetNumetric(datasetNames,currentListDataset,datasetShopify.DataSetList).then(resultVerify=>
				{
					for (var i = 0; i < resultVerify.length; i++ ) 
					{
						if(resultVerify[i].Result.Success)
						{
							resultBlogs.Result[resultVerify[i].Result.datasetName] = {};
							resultBlogs.Result[resultVerify[i].Result.datasetName].id=resultVerify[i].Result.Id;
						}
					}
					resultBlogs.Result.Data = datos;
					
					return ShopifyCon.sendRowsShopifyToNumetric(resultBlogs.Result).then(results=>
					{
						console.log("Completed Sync Shopify Blogs Data");
						utils.WriteFileTxt("Completed Sync Shopify Blogs Data");
						console.log("Shopify Blogs Data Synchronized:"+ JSON.stringify(resultBlogs.Result.Data));
						utils.WriteFileTxt("Shopify Blogs Data Synchronized:"+ JSON.stringify(resultBlogs.Result.Data));
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
};




var syncDataOrder = function syncDataOrder(lastUpdated,currentListDataset) 
{
	console.log("Started Sync Shopify Orders Data");
	utils.WriteFileTxt("Started Sync Shopify Orders Data");
	
	var resultEvent = {};
    resultEvent.Result = {};
    resultEvent.Result.Success = false;
	
	return 	ShopifyData.getOrders(lastUpdated).then(resultOrder=>	
	{ 
	
		if(resultOrder.Result.Success)
		{
			console.log("Shopify Order Data to Sync Row Count: "+ resultOrder.Result.Data.orders.length);
			utils.WriteFileTxt("Shopify Order Data to Sync Row Count: "+ resultOrder.Result.Data.orders.length);
			
			if(resultOrder.Result.Data.orders.length>0)
			{								
				var datos = resultOrder.Result.Data;	
				
				console.log("Shopify Orders Data to Sync:"+ JSON.stringify(datos));
				utils.WriteFileTxt("Shopify Orders Data to Sync:"+ JSON.stringify(datos));
				
				var datasetShopify = ShopifyCon.NumetricShopifyFormat(resultOrder.Result.Data,"id","orders");
	
				var datasetNames =[];
				
				for(var i=0; i<datasetShopify.DataSetList.length; i++)
				{				
					datasetNames.push(datasetShopify.DataSetList[i].name);
				}
				
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
						console.log("Completed Sync Shopify Order Data");
						utils.WriteFileTxt("Completed Sync Shopify Order Data");
						console.log("Shopify Orders Data Synchronized:"+ JSON.stringify(resultOrder.Result.Data));
						utils.WriteFileTxt("Shopify Orders Data Synchronized:"+ JSON.stringify(resultOrder.Result.Data));
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
};



var syncDataProducts = function syncDataProducts(lastUpdated,currentListDataset) 
{
	console.log("Started Sync Shopify Products Data");
	utils.WriteFileTxt("Started Sync Shopify Products Data");
	
	var resultEvent = {};
    resultEvent.Result = {};
    resultEvent.Result.Success = false;
	
	return 	ShopifyData.getProducts(lastUpdated).then(resultProducts=>																																																									//{
	{ 
		if(resultProducts.Result.Success)
		{	
			console.log("Shopify Products Data to Sync Row Count: "+ resultProducts.Result.Data.products.length);
			utils.WriteFileTxt("Shopify Products Data to Sync Row Count: "+ resultProducts.Result.Data.products.length);
			
			if(resultProducts.Result.Data.products.length>0)
			{				
				var datos = resultProducts.Result.Data;
				
				console.log("Shopify Products Data to Sync:"+ JSON.stringify(datos));
				utils.WriteFileTxt("Shopify Products Data to Sync:"+ JSON.stringify(datos));
			
				var datasetShopify = ShopifyCon.NumetricShopifyFormat(resultProducts.Result.Data,"id","products");
				
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
						console.log("Completed Sync Shopify Products Data");
						utils.WriteFileTxt("Completed Sync Shopify Products Data");
						console.log("Shopify Products Data Synchronized:"+ JSON.stringify(resultProducts.Result.Data));
						utils.WriteFileTxt("Shopify Products Data Synchronized:"+ JSON.stringify(resultProducts.Result.Data));
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
	
};



var syncDataCustomCollections = function syncDataCustomCollections(lastUpdated,currentListDataset) 
{	
	console.log("Started Sync Shopify Custom Collections Data");
	utils.WriteFileTxt("Started Sync Shopify Custom Collections Data");
	
	var resultEvent = {};
    resultEvent.Result = {};
    resultEvent.Result.Success = false;
	
	return 	ShopifyData.getCustomCollections(lastUpdated).then(resultCustomCollection=>		
	{ 
		if(resultCustomCollection.Result.Success)
		{			
			console.log("Shopify Custom Collections Data to Sync Row Count: "+ resultCustomCollection.Result.Data.custom_collection.length);
			utils.WriteFileTxt("Shopify Custom Collections Data to Sync Row Count: "+ resultCustomCollection.Result.Data.custom_collection.length);
			
			if(resultCustomCollection.Result.Data.custom_collection.length>0)
			{				
				var datos = resultCustomCollection.Result.Data;
				
				console.log("Shopify Custom Collections Data to Sync:"+ JSON.stringify(datos));
				utils.WriteFileTxt("Shopify Custom Collections Data to Sync:"+ JSON.stringify(datos));
			
				var datasetShopify = ShopifyCon.NumetricShopifyFormat(resultCustomCollection.Result.Data,"id","custom_collection");
				
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
						utils.WriteFileTxt("Completed Sync Shopify Custom Collections Data");
						console.log("Shopify Custom Collections Data Synchronized:"+ JSON.stringify(resultCustomCollection.Result.Data));
						utils.WriteFileTxt("Shopify Custom Collections Data Synchronized:"+ JSON.stringify(resultCustomCollection.Result.Data));
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
};



var syncDataTransactions = function syncDataTransactions(lastUpdated,currentListDataset) 
{	
	console.log("Started Sync Shopify Transactions Data");
	utils.WriteFileTxt("Started Sync Shopify Transactions Data");
	
	var resultEvent = {};
    resultEvent.Result = {};
    resultEvent.Result.Success = false;
	
	return 	ShopifyData.getTransactions(lastUpdated).then(resultTransactions=>									
	{ 
		if(resultTransactions.Result.Success)
		{	
			console.log("Shopify Transactions Data to Sync Row Count: "+ resultTransactions.Result.Data.transactions.length);
			utils.WriteFileTxt("Shopify Transactions Data to Sync Row Count: "+ resultTransactions.Result.Data.transactions.length);
			
			if(resultTransactions.Result.Data.transactions.length>0)
			{										
				var datos = resultTransactions.Result.Data;
								
				console.log("Shopify Transactions Data to Sync:"+ JSON.stringify(datos));
				utils.WriteFileTxt("Shopify Transactions Data to Sync:"+ JSON.stringify(datos));
				
				var datasetShopify = ShopifyCon.NumetricShopifyFormat(resultTransactions.Result.Data,"id","transactions");
				
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
						utils.WriteFileTxt("Completed Sync Shopify Transactions Data");
						console.log("Shopify Transactions Data Synchronized:"+ JSON.stringify(resultTransactions.Result.Data));
						utils.WriteFileTxt("Shopify Transactions Data Synchronized:"+ JSON.stringify(resultTransactions.Result.Data));
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
};


var syncDataArticles = function syncDataArticles(lastUpdated,currentListDataset) 
{	
	console.log("Started Sync Shopify Articles Data");
	utils.WriteFileTxt("Started Sync Shopify Articles Data");
	
	var resultEvent = {};
    resultEvent.Result = {};
    resultEvent.Result.Success = false;
	
	return 	ShopifyData.getArticles(lastUpdated).then(resultArticles=>									
	{ 
		if(resultArticles.Result.Success)
		{	
			console.log("Shopify Articles Data to Sync Row Count: "+ resultArticles.Result.Data.articles.length);
			utils.WriteFileTxt("Shopify Articles Data to Sync Row Count: "+ resultArticles.Result.Data.articles.length);
			
			if(resultArticles.Result.Data.articles.length>0)
			{	
				var datos = resultArticles.Result.Data;
						
				console.log("Shopify Articles Data to Sync:"+ JSON.stringify(datos));	
				utils.WriteFileTxt("Shopify Articles Data to Sync:"+ JSON.stringify(datos));				
				
				var datasetShopify = ShopifyCon.NumetricShopifyFormat(resultArticles.Result.Data,"id","articles");
				
				var datasetNames =['articles'];
				
				return numetricDataConnectorLogic.verifyCreateManyDatasetNumetric(datasetNames,currentListDataset,datasetShopify.DataSetList).then(resultVerify=>
				{
					for (var i = 0; i < resultVerify.length; i++ ) 
					{
						if(resultVerify[i].Result.Success)
						{
							resultArticles.Result[resultVerify[i].Result.datasetName] = {};
							resultArticles.Result[resultVerify[i].Result.datasetName].id=resultVerify[i].Result.Id;							
						}
					}
				
					resultArticles.Result.Data = datos;
					
					return ShopifyCon.sendRowsShopifyToNumetric(resultArticles.Result).then(results=>
					{
						console.log("Completed Sync Shopify Articles Data");
						utils.WriteFileTxt("Completed Sync Shopify Articles Data");
						console.log("Shopify Articles Data Synchronized:"+ JSON.stringify(resultArticles.Result.Data));
						utils.WriteFileTxt("Shopify Articles Data Synchronized:"+ JSON.stringify(resultArticles.Result.Data));
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
};




module.exports = 
{
    syncDataRetry : syncDataRetry
};

