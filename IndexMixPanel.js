'use strict';
const config = require("./Config/Config");
const MixPanelDataConSync = require("./DataConnectorSync/MixPanelDataConnectorSync");
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

	var dateEnd = moment().tz(conf.parameters().timezoneMixPanel).format("YYYY-MM-DD");
	var dateInitial = "";
	if(nconf.get('lastUpdateMixPanelEvent')!== "")
	{
		dateInitial = nconf.get('lastUpdateMixPanelEvent');
	}
	else
	{
		dateInitial = conf.parameters().initialDateTimeMixPanel;
	}
	var lastUpdated = 
	{
	  from_date :  dateInitial,
	  to_date : dateEnd
	};
	MixPanelDataConSync.syncDataRetry(lastUpdated);

};


cron.schedule(mixPanelJobFrequency, onJobStarted);


