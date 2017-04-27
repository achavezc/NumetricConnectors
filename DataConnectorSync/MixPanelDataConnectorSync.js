'use strict';
const NumetricCon = require("../DataConnectorApi/NumetricDataConnectorApi/NumetricDataConnectorApi");
const numetricDataConnectorLogic = require("../DataConnectorLogic/NumetricDataConnectorLogic");
const MixPanelCon = require("../DataConnectorLogic/MixPanelDataConnectorLogic");
const MixPanelData = require("../DataConnectorApi/MixPanelDataConnectorApi/MixPanelDataConnectorApi");
const config = require("../Config/Config");
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
		log.WriteLog("Message",'Started Sync MixPanel Data attempt number: '+ number,true,true);
		
		return syncData(lastUpdated)
		.catch(err=>
		{			
			log.WriteLog('Error','Error Sync MixPanel Data: '+ err,true,true);		
		});
	})
	.then(function () 
	{
		log.WriteLog('Message','Completed Sync MixPanel Data',true,true);
		
		// save datetime
		
		nconf.load();
		
		var dt = datetime.create();
		var fomratted = dt.format('Y-m-d');
		//console.log(fomratted);
		nconf.set('lastUpdateMixPanelEvent',fomratted);
		
		nconf.save(function (err) 
		{
			if (err) 
			{				
				log.WriteLog('Error','Error Sync MixPanel Data: '+err.message,true,true);
				return;
			}	
			
			log.WriteLog('Message','MixPanel Configuration last updated saved successfully. ' + fomratted,true,true);			
		});
	}, function (err) 
	{
		log.WriteLog('Error','Error Sync MixPanel Data: '+err.message,true,true);
	});
};


var syncData = function syncData(lastUpdated) 
{
    var resultEvent = {};
    resultEvent.Result = {};
    resultEvent.Result.Success = false;
	
	return NumetricCon.getDataSetNumetric().then(currentListDataset=>
	{
		return syncDataEvents(lastUpdated,currentListDataset).then(resultEvents=>
		{
			var result = false;
		
			if(resultEvents.length>0)
			{
				result =  resultEvents[0].Result.Success;
			}
			
			resultEvent.Result.Success = result;
			return resultEvent;
		});
	});
};


var syncDataEvents = function syncDataEvents(lastUpdated,currentListDataset) 
{	
	log.WriteLog('Message','Started Sync MixPanel Event Data',true,true);
		
	var resultEvent = {};
    resultEvent.Result = {};
    resultEvent.Result.Success = false;
		
	return 	MixPanelData.getEvents(lastUpdated).then(resultEvents=>
	{	
	  if(resultEvents.Result.Success)
	  { 			
		  log.WriteLog("Message",'MixPanel Events Data to Sync Row Count: ' + resultEvents.Result.Data.length,true,true);
			
		  if(resultEvents.Result.Data.length>0)
		  {			
			var datasetMixPanel = MixPanelCon.generateDataSetMixPanelAux(resultEvents.Result);	
						
			var datos = resultEvents.Result.Data;
			var datasetNames =['MixPanelEvent'];
					
			log.WriteLog("Message",'MixPanel Events Data to Sync: ' + JSON.stringify(datos),false,true);
					
			return numetricDataConnectorLogic.verifyCreateManyDatasetNumetric(datasetNames,currentListDataset,datasetMixPanel.DataSetList).then(resultVerify=>
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

				return MixPanelCon.updateRowsMixPanel(resultEvents.Result).then(results=>
				{
					log.WriteLog('Message','Completed Sync MixPanel Events Data',true,true);
					log.WriteLog("Message",'MixPanel Events Data Synchronized:' + JSON.stringify(resultEvents.Result.Data),false,true);
											
					return results;
				});
			}); 
		  }
	  }
	})
};


module.exports = 
{   
	syncDataRetry : syncDataRetry
};
