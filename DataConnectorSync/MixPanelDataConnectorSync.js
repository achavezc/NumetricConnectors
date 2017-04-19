'use strict';
const NumetricCon = require("../DataConnectorApi/NumetricDataConnectorApi/NumetricDataConnectorApi");
const numetricDataConnectorLogic = require("../DataConnectorLogic/NumetricDataConnectorLogic");
const MixPanelCon = require("../DataConnectorLogic/MixPanelDataConnectorLogic");
const MixPanelData = require("../DataConnectorApi/MixPanelDataConnectorApi/MixPanelDataConnectorApi");
const config = require("../Config/Config");
const promiseRetry = require('promise-retry');
var nconf = require('nconf');
nconf.use('file', { file: '../ConfigDate/DateTimeLastSync.json' });
var conf = new config();
var datetime = require('node-datetime');
const utils = require("../Helper/Util");

var options = {
  retries: conf.parameters().retriesCount//,
  //factor: 1,
  //minTimeout: 1000,
  //maxTimeout: 2000,
  //randomize: true
};


var syncDataRetry = function syncDataRetry(lastUpdated) 
{
	//TODO:syncData
	//TODO: Config.CountRetry
	promiseRetry(options,function (retry, number) {
    console.log('attempt number', number);
		return syncData(lastUpdated);
	})
	.then(function () {
		// save datetime
		nconf.load();
		var dt = datetime.create();
		var fomratted = dt.format('Y-m-d');
		//console.log(fomratted);
		nconf.set('lastUpdateMixPanelEvent',fomratted);
		nconf.save(function (err) {
			if (err) {
			console.error(err.message);
			return;
			}
			console.log('Configuration saved successfully.');
		});
	}, function (err) {
		console.log(err);
	});
};


var syncData = function syncData(lastUpdated) 
{
    var resultEvent = {};
    resultEvent.Result = {};
    resultEvent.Result.Success = false;
	
	return NumetricCon.getDataSetNumetric().then(currentListDataset=>{
		return syncDataEvents(lastUpdated,currentListDataset).then(resultEvents=>{
			var result = false;
			if(resultEvents.length>0){
				result =  resultEvents[0].Result.Success;
			}
			resultEvent.Result.Success = result;
			return resultEvent;
		});
	});
};

var syncDataEvents = function syncDataEvents(lastUpdated,currentListDataset) 
{
	utils.WriteFileTxt('syncDataEvents');	
	
	var resultEvent = {};
    resultEvent.Result = {};
    resultEvent.Result.Success = false;
	
		
	//return 	MixPanelData.getEvents(lastUpdated).then(resultEvents=>
	return 	MixPanelData.getEvents(lastUpdated).then(resultEvents=>
	{	
		utils.WriteFileTxt('getEvents.then');
		utils.WriteFileTxt("resultEvents:"+ JSON.stringify(resultEvents));
		
		  if(resultEvents.Result.Success)
		  {  
			console.log("MixPanel Events Data to Sync Row Count: "+ resultEvents.Result.Data.length);
			utils.WriteFileTxt("MixPanel Events Data to Sync Row Count: "+ resultEvents.Result.Data.length);
			
			utils.WriteFileTxt('resultEvents.Result.Success');
				
			  if(resultEvents.Result.Data.length>0)
			  {
				utils.WriteFileTxt('resultEvents.Result.Data.length>0');
				
				var datasetMixPanel = MixPanelCon.generateDataSetMixPanelAux(resultEvents.Result);	
				utils.WriteFileTxt("datasetMixPanel:"+ JSON.stringify(datasetMixPanel));
				
				var datos = resultEvents.Result.Data;
				var datasetNames =['MixPanelEvent'];
				utils.WriteFileTxt("datos:"+ JSON.stringify(datos));
				
				return numetricDataConnectorLogic.verifyCreateManyDatasetNumetric(datasetNames,currentListDataset,datasetMixPanel.DataSetList).then(resultVerify=>
				{
					utils.WriteFileTxt('verifyCreateManyDatasetNumetric.then');
					utils.WriteFileTxt("datos:"+ JSON.stringify(resultVerify));
					
					
					for (var i = 0; i < resultVerify.length; i++ ) {
						if(resultVerify[i].Result.Success){
							resultEvents.Result[resultVerify[i].Result.datasetName] = {};
							resultEvents.Result[resultVerify[i].Result.datasetName].id=resultVerify[i].Result.Id;
						}
					}
					resultEvents.Result.Data = datos;

					return MixPanelCon.updateRowsMixPanel(resultEvents.Result).then(results=>
					{
						console.log("Completed Sync MixPanel Events");
						utils.WriteFileTxt("Completed Sync MixPanel Events");
						//console.log("Sync MixPanel Events Data Synchronized:"+ JSON.stringify(resultEvents.Result.Data));
						utils.WriteFileTxt("Sync MixPanel Events Data Synchronized:"+ JSON.stringify(resultEvents.Result.Data));
						return results;
					});
				}); 
			  }
		  }
	})
};


module.exports = 
{
    syncData : syncData,
	syncDataRetry : syncDataRetry
};
