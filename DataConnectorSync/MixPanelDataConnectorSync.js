'use strict'
const NumetricCon = require("../DataConnectorApi/NumetricDataConnectorApi/NumetricDataConnectorApi")
const numetricDataConnectorLogic = require("../DataConnectorLogic/NumetricDataConnectorLogic")
const MixPanelCon = require("../DataConnectorLogic/MixPanelDataConnectorLogic")
const MixPanelData = require("../DataConnectorApi/MixPanelDataConnectorApi/MixPanelDataConnectorApi")
const inputsMixPanel = require("../SampleData/exampleDataMixPanel")
const inputsShopify = require("../SampleData/exampleDataShopify")
const config = require("../Config/Config")
const promiseRetry = require('promise-retry')
var nconf = require('nconf');
nconf.use('file', { file: '../ConfigDate/DateTimeLastSync.json' });
var conf = new config();
var datetime = require('node-datetime');
var conf = new config();



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

		return syncData(lastUpdated)
		.catch(retry);
	})
	.then(function (value) {
		// save datetime
		nconf.load();
		var dt = datetime.create();
		var fomratted = dt.format('Y/m/d');
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
	return syncDataEvents(lastUpdated).then(result=>
			{
				return resultEvent.Result.Success= true;
			});     

}
var syncDataEvents = function syncDataEvents(lastUpdated) 
{
	var resultEvent = {};
    resultEvent.Result = {}
    resultEvent.Result.Success = false;
	return 	MixPanelData.getEvents(lastUpdated,function(resultEvent){	
		  if(result.Result.Success){  
			  if(result.Result.Data.length>0){  
					var datasetMixPanel = MixPanelCon.generateDataSetMixPanelAux(result.Result.Data);
					var datos = result.Result.Data;

					numetricDataConnectorLogic.verifyCreateDatasetNumetric("MixPanelEvent",datasetMixPanel.DataSetList).then(resultEvent=>{
						resultEvent.Result.MixPanelEvent = {};
						resultEvent.Result.MixPanelEvent.id =  resultEvent.Result.Id;
						resultEvent.Result.Data = datos;
						MixPanelCon.updateRowsMixPanel(resultEvent.Result);
						

					})
			  }
		  }
	});
}


module.exports = 
{
    syncData : syncData,
	syncDataRetry : syncDataRetry
};
