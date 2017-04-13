'use strict'
const NumetricCon = require("./DataConnectorApi/NumetricDataConnectorApi/NumetricDataConnectorApi")
const numetricDataConnectorLogic = require("./DataConnectorLogic/NumetricDataConnectorLogic")
const MixPanelCon = require("./DataConnectorLogic/MixPanelDataConnectorLogic")
const MixPanelData = require("./DataConnectorApi/MixPanelDataConnectorApi/MixPanelDataConnectorApi")
const inputsMixPanel = require("./SampleData/exampleDataMixPanel")
const inputsShopify = require("./SampleData/exampleDataShopify")
const config = require("./Config/Config")
const MixPanelDataConSync = require("./DataConnectorSync/MixPanelDataConnectorSync")
const promiseRetry = require('promise-retry')
var datetime = require('node-datetime');
var conf = new config();
var cron = require('node-cron');

var mixPanelJobFrequency = conf.parameters().mixPanelJobFrequency ;


var onJobStarted = function()
{
	var nconf = require('nconf');
	nconf.use('file', { file: './ConfigDate/DateTimeLastSync.json' });
	nconf.load();

	var date = new Date();
	var moment = require('moment-timezone');
	
    console.log('Job started on \t' + date);
	
	//console.log(moment().tz("America/Los_Angeles").format("YYYY-MM-DD"));
	var dateEnd = moment().tz("America/Los_Angeles").format("YYYY-MM-DD");
	var dateInitial = "";
	if(nconf.get('lastUpdateMixPanelEvent')!= ""){
		dateInitial = nconf.get('lastUpdateMixPanelEvent');
	}else{
		dateInitial = conf.parameters().initialDateTimeMixPanel;
	}

	var dt = datetime.create();
	var fomratted = dt.format('Y-m-d');


	var lastUpdated = {
	  from_date :  conf.parameters().initialDateTimeMixPanel,//dateInitial,
	  to_date : dateEnd//formatted
	}
	//console.log(lastUpdated);
	MixPanelDataConSync.syncDataRetry(lastUpdated);
	
    return;
};


cron.schedule(mixPanelJobFrequency, onJobStarted);


