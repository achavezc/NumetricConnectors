'use strict';
const numetricCon = require("../DataConnectorApi/NumetricDataConnectorApi/NumetricDataConnectorApi");
const shopifyCon = require("../DataConnectorLogic/ShopifyDataConnectorLogic");
const numetricDataConnectorLogic = require("../DataConnectorLogic/NumetricDataConnectorLogic");
const shopifyData = require("../DataConnectorApi/ShopifyDataConnectorApi/ShopifyDataDataConnectorApi");
const config = require("../Config/Config");
const utils = require("../Helper/Util");
const promiseRetry = require('promise-retry');
const log=require('../Log/Log.js');

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
		log.WriteLog('Message','Started Sync Shopify Data attempt number: '+ number,true,true);
				
		return syncData(lastUpdated)
		.catch(err=>
		{			
			log.WriteLog('Error','Error Sync Shopify Data: '+ err,true,true);			
		});
	})
	.then(function ()
	{
		log.WriteLog('Message','Completed Sync Shopify Data ',true,true);		
				
		// save Last DateTime Sync
		
		nconf.load();
		
		var dt = datetime.create();
		var fomratted = dt.format('m/d/Y H:M:S');
		nconf.set('lastUpdateShopify',fomratted);
		
		nconf.save(function (err) 
		{
			if (err) 
			{
				log.WriteLog('Error','Error Sync Shopify Data: '+err.message,true,true);
				return;
			}
			
			log.WriteLog('Message','Shopify Configuration last updated saved successfully. ' + fomratted,true,true);				
		});
	}, function (err) 
	{		
		log.WriteLog('Error','Error Sync Shopify Data: '+err.message,true,true);
	});
};

var syncData = function syncData(lastUpdated)
{
    var resultEvent = {};
    resultEvent.Result = {};
    resultEvent.Result.Success = false;
					
    return numetricCon.getDataSetNumetric().then(currentListDataset=>
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
	log.WriteLog('Message','Started Sync Shopify Customer Data',true,true);
		
	var resultEvent = {};
    resultEvent.Result = {};
    resultEvent.Result.Success = false;

	return 	shopifyData.getCustomers(lastUpdated).then(resultCustomer=>
	{ 				
		if(resultCustomer.Result.Success)
		{				
			log.WriteLog("Message",'Shopify Customer Data to Sync Row Count: ' + resultCustomer.Result.Data.customers.length,true,true);
			
			if(resultCustomer.Result.Data.customers.length>0)
			{				
				var datos = resultCustomer.Result.Data;
						
				log.WriteLog("Message",'Shopify Customer Data to Sync: ' + JSON.stringify(datos),false,true);		
								
				var datasetShopify = shopifyCon.NumetricShopifyFormat(resultCustomer.Result.Data,"id","customers");
												
				var datasetNames =[];
				
				for(var i=0; i<datasetShopify.DataSetList.length; i++)
				{				
					datasetNames.push(datasetShopify.DataSetList[i].name);
				}
				
				return numetricDataConnectorLogic.verifyCreateManyDatasetNumetric(datasetNames,currentListDataset,datasetShopify.DataSetList).then(resultVerify=>
				{					
					for (var i = 0; i < resultVerify.length; i++ ) 
					{
						if(resultVerify[i].Result.Success)
						{
							resultCustomer.Result[resultVerify[i].Result.datasetName] = {};
							resultCustomer.Result[resultVerify[i].Result.datasetName].id=resultVerify[i].Result.Id;
						}
					}
					resultCustomer.Result.Data = datos;									
					
					return shopifyCon.sendRowsShopifyToNumetric(resultCustomer.Result).then(results=>
					{
						log.WriteLog('Message','Completed Sync Shopify Customer Data',true,true);
					
						log.WriteLog("Message",'Shopify Customer Data Synchronized:' + JSON.stringify(resultCustomer.Result.Data),false,true);
											
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
	log.WriteLog('Message','Started Sync Shopify Smart Collections Data',true,true);
	
	var resultEvent = {};
    resultEvent.Result = {};
    resultEvent.Result.Success = false;
	
	return 	shopifyData.getSmartCollections(lastUpdated).then(resultSmartCollection=>		
	{ 
		if(resultSmartCollection.Result.Success)
		{			
			log.WriteLog('Message','Shopify Smart Collections Data to Sync Row Count: ' + resultSmartCollection.Result.Data.smart_collection.length,true,true);
									
			if(resultSmartCollection.Result.Data.smart_collection.length>0)
			{					
				var datos = resultSmartCollection.Result.Data;
						
				log.WriteLog('Message','Shopify Smart Collections Data to Sync:'+ JSON.stringify(datos),false,true);
				
				var datasetShopify = shopifyCon.NumetricShopifyFormat(resultSmartCollection.Result.Data,"id","smart_collection");
				
				var datasetNames =['smart_collection'];				
				
				return numetricDataConnectorLogic.verifyCreateManyDatasetNumetric(datasetNames,currentListDataset,datasetShopify.DataSetList).then(resultVerify=>
				{
					for (var i = 0; i < resultVerify.length; i++ ) 
					{
						if(resultVerify[i].Result.Success)
						{
							resultSmartCollection.Result[resultVerify[i].Result.datasetName] = {};
							resultSmartCollection.Result[resultVerify[i].Result.datasetName].id=resultVerify[i].Result.Id;
						}
					}
					resultSmartCollection.Result.Data = datos;
					
					return shopifyCon.sendRowsShopifyToNumetric(resultSmartCollection.Result).then(results=>
					{						
						log.WriteLog('Message','Completed Sync Shopify Smart Collections Data',true,true);
						log.WriteLog('Message','Shopify Smart Collections Data Synchronized:' + JSON.stringify(resultSmartCollection.Result.Data),false,true);					
					
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
	log.WriteLog('Message','Started Sync Shopify Events Data',true,true);

	var resultEvent = {};
    resultEvent.Result = {};
    resultEvent.Result.Success = false;
	
	return 	shopifyData.getEvents(lastUpdated).then(resultEvents=>	
	{ 
		if(resultEvents.Result.Success)
		{	
			log.WriteLog('Message','Shopify Events Data to Sync Row Count:' + resultEvents.Result.Data.events.length,true,true);			
			
			if(resultEvents.Result.Data.events.length>0)
			{				
				var datos = resultEvents.Result.Data;
								
				log.WriteLog('Message','Shopify Events Data to Sync:'+ JSON.stringify(datos),false,true);
							
				var datasetShopify = shopifyCon.NumetricShopifyFormat(resultEvents.Result.Data,"id","events");
				
				var datasetNames =['events'];
				
				return numetricDataConnectorLogic.verifyCreateManyDatasetNumetric(datasetNames,currentListDataset,datasetShopify.DataSetList).then(resultVerify=>
				{
					for (var i = 0; i < resultVerify.length; i++ ) 
					{
						if(resultVerify[i].Result.Success)
						{
							resultEvents.Result[resultVerify[i].Result.datasetName] = {};
							resultEvents.Result[resultVerify[i].Result.datasetName].id=resultVerify[i].Result.Id;
						}
					}
					resultEvents.Result.Data = datos;
					
					return shopifyCon.sendRowsShopifyToNumetric(resultEvents.Result).then(results=>
					{						
						log.WriteLog('Message','Completed Sync Shopify Events Data',true,true);
						log.WriteLog('Message','Shopify Events Data Synchronized:' + JSON.stringify(resultEvents.Result.Data),false,true);							
						
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
	log.WriteLog('Message','Started Sync Shopify Comments Data',true,true);	
	
	var resultEvent = {};
    resultEvent.Result = {};
    resultEvent.Result.Success = false;
	
	return 	shopifyData.getComments(lastUpdated).then(resultComments=>		
	{ 
		if(resultComments.Result.Success)
		{			
			log.WriteLog('Message','Shopify Comments Data to Sync Row Count:' + resultComments.Result.Data.comments.length,true,true);
			
			if(resultComments.Result.Data.comments.length>0)
			{				
				var datos = resultComments.Result.Data;
			
				log.WriteLog('Message','Shopify Comments Data to Sync:'+ JSON.stringify(datos),false,true);				
			
				var datasetShopify = shopifyCon.NumetricShopifyFormat(resultComments.Result.Data,"id","comments");
				
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
					
					return shopifyCon.sendRowsShopifyToNumetric(resultComments.Result).then(results=>
					{						
						log.WriteLog('Message','Completed Sync Shopify Comments Data',true,true);
						log.WriteLog('Message','Shopify Comments Data Synchronized:' + JSON.stringify(resultComments.Result.Data),false,true);	
						
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
	log.WriteLog('Message','Started Sync Shopify Blogs Data',true,true);
	
	var resultEvent = {};
    resultEvent.Result = {};
    resultEvent.Result.Success = false;
	
	return 	shopifyData.getBlogs(lastUpdated).then(resultBlogs=>		
	{ 
		if(resultBlogs.Result.Success)
		{			
			log.WriteLog('Message','Shopify Blogs Data to Sync Row Count:' + resultBlogs.Result.Data.blogs.length,true,true);
			
			if(resultBlogs.Result.Data.blogs.length>0)
			{				
				var datos = resultBlogs.Result.Data;
				
				log.WriteLog('Message','Shopify Blogs Data to Sync:'+ JSON.stringify(datos),false,true);	
				
				var datasetShopify = shopifyCon.NumetricShopifyFormat(resultBlogs.Result.Data,"id","blogs");
				
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
					
					return shopifyCon.sendRowsShopifyToNumetric(resultBlogs.Result).then(results=>
					{						
						log.WriteLog('Message','Completed Sync Shopify Blogs Data',true,true);
						log.WriteLog('Message','Shopify Blogs Data Synchronized:' + JSON.stringify(resultBlogs.Result.Data),false,true);						
						
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
	log.WriteLog('Message','Started Sync Shopify Orders Data',true,true);
	
	var resultEvent = {};
    resultEvent.Result = {};
    resultEvent.Result.Success = false;
	
	return 	shopifyData.getOrders(lastUpdated).then(resultOrder=>	
	{ 
	
		if(resultOrder.Result.Success)
		{
			log.WriteLog('Message','Shopify Order Data to Sync Row Count: ' + resultOrder.Result.Data.orders.length,true,true);
			
			if(resultOrder.Result.Data.orders.length>0)
			{								
				var datos = resultOrder.Result.Data;	
				
				log.WriteLog('Message','Shopify Orders Data to Sync:'+ JSON.stringify(datos),false,true);
							
				var datasetShopify = shopifyCon.NumetricShopifyFormat(resultOrder.Result.Data,"id","orders");
	
				var datasetNames =[];
				
				for(var i=0; i<datasetShopify.DataSetList.length; i++)
				{				
					datasetNames.push(datasetShopify.DataSetList[i].name);
				}
				
				return numetricDataConnectorLogic.verifyCreateManyDatasetNumetric(datasetNames,currentListDataset,datasetShopify.DataSetList).then(resultVerify=>
				{				
					for (var i = 0; i < resultVerify.length; i++ ) 
					{
						if(resultVerify[i].Result.Success)
						{
							resultOrder.Result[resultVerify[i].Result.datasetName] = {};
							resultOrder.Result[resultVerify[i].Result.datasetName].id=resultVerify[i].Result.Id;
						}
					}
					resultOrder.Result.Data = datos;
					
					return shopifyCon.sendRowsShopifyToNumetric(resultOrder.Result).then(results=>
					{					
						log.WriteLog('Message','Completed Sync Shopify Order Data',true,true);
						log.WriteLog('Message','Shopify Orders Data Synchronized:' + JSON.stringify(resultOrder.Result.Data),false,true);						
						
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
	log.WriteLog('Message','Started Sync Shopify Products Data',true,true);	
	
	var resultEvent = {};
    resultEvent.Result = {};
    resultEvent.Result.Success = false;
	
	return 	shopifyData.getProducts(lastUpdated).then(resultProducts=>																																																									//{
	{ 
		if(resultProducts.Result.Success)
		{	
			log.WriteLog('Message','Shopify Products Data to Sync Row Count: ' + resultProducts.Result.Data.products.length,true,true);
						
			if(resultProducts.Result.Data.products.length>0)
			{				
				var datos = resultProducts.Result.Data;
				
				log.WriteLog('Message','Shopify Products Data to Sync:'+ JSON.stringify(datos),false,true);
				
				var datasetShopify = shopifyCon.NumetricShopifyFormat(resultProducts.Result.Data,"id","products");
				
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
					return shopifyCon.sendRowsShopifyToNumetric(resultProducts.Result).then(results=>
					{
						log.WriteLog('Message','Completed Sync Shopify Products Data',true,true);
						log.WriteLog('Message','Shopify Products Data Synchronized:' + JSON.stringify(resultProducts.Result.Data),false,true);						
						
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
	log.WriteLog('Message','Started Sync Shopify Custom Collections Data',true,true);		
	
	var resultEvent = {};
    resultEvent.Result = {};
    resultEvent.Result.Success = false;
	
	return 	shopifyData.getCustomCollections(lastUpdated).then(resultCustomCollection=>		
	{ 
		if(resultCustomCollection.Result.Success)
		{			
			log.WriteLog('Message','Shopify Custom Collections Data to Sync Row Count: ' + resultCustomCollection.Result.Data.custom_collection.length,true,true);
			
			if(resultCustomCollection.Result.Data.custom_collection.length>0)
			{				
				var datos = resultCustomCollection.Result.Data;
				
				log.WriteLog('Message','Shopify Custom Collections Data to Sync:'+ JSON.stringify(datos),false,true);
								
				var datasetShopify = shopifyCon.NumetricShopifyFormat(resultCustomCollection.Result.Data,"id","custom_collection");
				
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
					return shopifyCon.sendRowsShopifyToNumetric(resultCustomCollection.Result).then(results=>
					{						
						log.WriteLog('Message','Completed Sync Shopify Custom Collections Data',true,true);
						log.WriteLog('Message','Shopify Custom Collections Data Synchronized:' + JSON.stringify(resultCustomCollection.Result.Data),false,true);						
						
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
	log.WriteLog('Message','Started Sync Shopify Transactions Data',true,true);	
	
	var resultEvent = {};
    resultEvent.Result = {};
    resultEvent.Result.Success = false;
	
	return 	shopifyData.getTransactions(lastUpdated).then(resultTransactions=>									
	{ 
		if(resultTransactions.Result.Success)
		{	
			log.WriteLog('Message','Shopify Transactions Data to Sync Row Count: ' + resultTransactions.Result.Data.transactions.length,true,true);
						
			if(resultTransactions.Result.Data.transactions.length>0)
			{										
				var datos = resultTransactions.Result.Data;
								
				log.WriteLog('Message','Shopify Transactions Data to Sync:'+ JSON.stringify(datos),false,true);				
				
				var datasetShopify = shopifyCon.NumetricShopifyFormat(resultTransactions.Result.Data,"id","transactions");
				
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
					return shopifyCon.sendRowsShopifyToNumetric(resultTransactions.Result).then(results=>
					{
						log.WriteLog('Message','Completed Sync Shopify Transactions Data',true,true);
						log.WriteLog('Message','Shopify Transactions Data Synchronized:' + JSON.stringify(resultTransactions.Result.Data),false,true);
						
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
	log.WriteLog('Message','Started Sync Shopify Articles Data',true,true);	
	
	var resultEvent = {};
    resultEvent.Result = {};
    resultEvent.Result.Success = false;
	
	return 	shopifyData.getArticles(lastUpdated).then(resultArticles=>									
	{ 
		if(resultArticles.Result.Success)
		{	
			log.WriteLog('Message','Shopify Articles Data to Sync Row Count: ' + resultArticles.Result.Data.articles.length,true,true);
						
			if(resultArticles.Result.Data.articles.length>0)
			{	
				var datos = resultArticles.Result.Data;					

				log.WriteLog('Message','Shopify Articles Data to Sync:'+ JSON.stringify(datos),false,true);		
				
				var datasetShopify = shopifyCon.NumetricShopifyFormat(resultArticles.Result.Data,"id","articles");
				
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
					
					return shopifyCon.sendRowsShopifyToNumetric(resultArticles.Result).then(results=>
					{											
						log.WriteLog('Message','Completed Sync Shopify Articles Data',true,true);
						log.WriteLog('Message','Shopify Articles Data Synchronized:' + JSON.stringify(resultArticles.Result.Data),false,true);						
						
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

