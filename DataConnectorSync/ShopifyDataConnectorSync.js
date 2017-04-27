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
	
		return syncDataCustomer(lastUpdated,lstDataSet).then(resultCustomer=>
		{				
			 return syncDataEntity(lastUpdated,lstDataSet,'comment').then(resultComments=>
			{					
				 return syncDataEntity(lastUpdated,lstDataSet,'product').then(resultProducts=>
				 {
					 return syncDataEntity(lastUpdated,lstDataSet,'blog').then(resultBlogs=>
					 {						
						 return syncDataArticles(lastUpdated,lstDataSet).then(resultArticles=>
						 {			
							 return syncDataEntity(lastUpdated,lstDataSet,'smartCollection').then(resultSmartCollections=>
							 {
								 return syncDataEntity(lastUpdated,lstDataSet,'customCollection').then(resultCustomCollections=>
								 {
									  return syncDataTransactions(lastUpdated,lstDataSet).then(resultTransactions=>
									  {											
										return syncDataEntity(lastUpdated,lstDataSet,'event').then(resultEvents=>
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


var syncDataOrder = function syncDataOrder(lastUpdated,currentListDataset) 
{	
	log.WriteLog('Message','Started Sync Shopify Orders Data',true,true);
	
	var resultEvent = {};
    resultEvent.Result = {};
    resultEvent.Result.Success = false;
	
	return 	shopifyData.getData(lastUpdated,'order').then(resultOrder=>	
	{ 	
		if(resultOrder.Result.Success)
		{
			log.WriteLog('Message','Shopify Order Data to Sync Row Count: ' + resultOrder.Result.Data.order.length,true,true);
			
			if(resultOrder.Result.Data.order.length>0)
			{								
				var datos = resultOrder.Result.Data;	
				
				log.WriteLog('Message','Shopify Orders Data to Sync:'+ JSON.stringify(datos),false,true);
							
				var datasetShopify = shopifyCon.NumetricShopifyFormat(resultOrder.Result.Data,"id","order");
	
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
			log.WriteLog('Message','Shopify Transactions Data to Sync Row Count: ' + resultTransactions.Result.Data.transaction.length,true,true);
						
			if(resultTransactions.Result.Data.transaction.length>0)
			{										
				var datos = resultTransactions.Result.Data;
								
				log.WriteLog('Message','Shopify Transactions Data to Sync:'+ JSON.stringify(datos),false,true);				
				
				var datasetShopify = shopifyCon.NumetricShopifyFormat(resultTransactions.Result.Data,"id","transaction");
				
				var datasetNames =['transaction'];
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
	
	return 	shopifyData.getData(lastUpdated,'article').then(resultArticles=>									
	{ 
		if(resultArticles.Result.Success)
		{	
			log.WriteLog('Message','Shopify Articles Data to Sync Row Count: ' + resultArticles.Result.Data.article.length,true,true);
						
			if(resultArticles.Result.Data.article.length>0)
			{	
				var datos = resultArticles.Result.Data;					

				log.WriteLog('Message','Shopify Articles Data to Sync:'+ JSON.stringify(datos),false,true);		
				
				var datasetShopify = shopifyCon.NumetricShopifyFormat(resultArticles.Result.Data,"id","article");
				
				var datasetNames =['article'];
				
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


var syncDataEntity = function syncDataEntity(lastUpdated,currentListDataset,entity) 
{	
	log.WriteLog('Message','Started Sync Shopify ' + entity + ' Data',true,true);		
	
	var resultEvent = {};
    resultEvent.Result = {};
    resultEvent.Result.Success = false;
	
	return 	shopifyData.getData(lastUpdated,entity).then(resultEntity=>		
	{ 
		if(resultEntity.Result.Success)
		{			
			log.WriteLog('Message','Shopify ' + entity + ' Data to Sync Row Count: ' + resultEntity.Result.Data[entity].length,true,true);
			
			if(resultEntity.Result.Data[entity].length>0)
			{				
				var datos = resultEntity.Result.Data;
				
				log.WriteLog('Message','Shopify ' + entity + ' Data to Sync:'+ JSON.stringify(datos),false,true);
								
				var datasetShopify = shopifyCon.NumetricShopifyFormat(resultEntity.Result.Data,'id',entity);
				
				var datasetNames =[entity];
				
				return numetricDataConnectorLogic.verifyCreateManyDatasetNumetric(datasetNames,currentListDataset,datasetShopify.DataSetList).then(resultVerify=>
				{
					for (var i = 0; i < resultVerify.length; i++ ) {
						if(resultVerify[i].Result.Success){
							resultEntity.Result[resultVerify[i].Result.datasetName] = {};
							resultEntity.Result[resultVerify[i].Result.datasetName].id=resultVerify[i].Result.Id;
						}
					}
					resultEntity.Result.Data = datos;
					return shopifyCon.sendRowsShopifyToNumetric(resultEntity.Result).then(results=>
					{						
						log.WriteLog('Message','Completed Sync Shopify ' + entity + ' Data',true,true);
						log.WriteLog('Message','Shopify ' + entity + ' Data Synchronized:' + JSON.stringify(resultEntity.Result.Data),false,true);						
						
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


module.exports = 
{
    syncDataRetry : syncDataRetry
};

