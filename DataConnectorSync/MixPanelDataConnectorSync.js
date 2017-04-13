'use strict'
const NumetricCon = require("../DataConnectorApi/NumetricDataConnectorApi/NumetricDataConnectorApi")
const numetricDataConnectorLogic = require("../DataConnectorLogic/NumetricDataConnectorLogic")
const MixPanelCon = require("../DataConnectorLogic/MixPanelDataConnectorLogic")
const MixPanelData = require("../DataConnectorApi/MixPanelDataConnectorApi/MixPanelDataConnectorApi")
const inputsMixPanel = require("../SampleData/exampleDataMixPanel")
const inputsShopify = require("../SampleData/exampleDataShopify")
const ShopifyCon = require("../DataConnectorLogic/ShopifyDataConnectorLogic")
const config = require("../Config/Config")
const promiseRetry = require('promise-retry')
var nconf = require('nconf');
nconf.use('file', { file: '../ConfigDate/DateTimeLastSync.json' });
var conf = new config();
var datetime = require('node-datetime');
var conf = new config();
const utils = require("../Helper/Util")


var options = {
  retries: conf.parameters().retriesCount//,
  //factor: 1,
  //minTimeout: 1000,
  //maxTimeout: 2000,
  //randomize: true
}


var syncDataRetry = function syncDataRetry(lastUpdated) 
{
	//TODO:syncData
	//TODO: Config.CountRetry
	promiseRetry(options,function (retry, number) {
    console.log('attempt number', number);

		return syncData(lastUpdated);
		//.catch(retry);
	})
	.then(function (value) {
		// save datetime
		nconf.load();
		var dt = datetime.create();
		var fomratted = dt.format('Y-m-d');
		console.log(fomratted);
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
}


var syncData = function syncData(lastUpdated) 
{
    var resultEvent = {};
    resultEvent.Result = {}
    resultEvent.Result.Success = false;
	
	return NumetricCon.getDataSetNumetric().then(currentListDataset=>{
		return syncDataEvents(lastUpdated,currentListDataset).then(resultEvents=>{
			resultEvent.Result.Success = true;
			return resultEvent;
		});
	});
}

var syncDataEvents = function syncDataEvents(lastUpdated,currentListDataset) 
{
	var resultEvent = {};
    resultEvent.Result = {}
    resultEvent.Result.Success = false;
	
		
	//return 	MixPanelData.getEvents(lastUpdated).then(resultEvents=>
	return 	MixPanelData.getEvents(lastUpdated).then(resultEvents=>
	{			
		  if(resultEvents.Result.Success)
		  {  
			  if(resultEvents.Result.Data.length>0)
			  {
					var datasetMixPanel = MixPanelCon.generateDataSetMixPanelAux(resultEvents.Result);	
					var datos = resultEvents.Result.Data;
				  var datasetNames =['MixPanelEvent'];
				return numetricDataConnectorLogic.verifyCreateManyDatasetNumetric(datasetNames,currentListDataset,datasetMixPanel.DataSetList).then(resultVerify=>
				{
					
					for (var i = 0; i < resultVerify.length; i++ ) {
						if(resultVerify[i].Result.Success){
							resultEvents.Result[resultVerify[i].Result.datasetName] = {};
							resultEvents.Result[resultVerify[i].Result.datasetName].id=resultVerify[i].Result.Id;
						}
					}
					resultEvents.Result.Data = datos;
					//utils.WriteFileTxt(JSON.stringify(resultEvents.Result));
					//MixPanelCon.updateRowsMixPanel(resultEvents.Result);
					/*
					return ShopifyCon.sendRowsShopifyToNumetric(resultEvents.Result).then(results=>
					{
						return results;
					});
					*/
					return MixPanelCon.updateRowsMixPanel(resultEvents.Result).then(results=>
					{
						return results;
					});
				}); 
			  }
		  }
	})
}


module.exports = 
{
    syncData : syncData,
	syncDataRetry : syncDataRetry
};
