'use strict';

const shopifyData = require("./DataConnectorApi/ShopifyDataConnectorApi/ShopifyDataDataConnectorApi");
const config = require("./Config/Config");
const utils = require("./Helper/Util");
const shopifyDataConSync = require("./DataConnectorSync/ShopifyDataConnectorSync");
const log=require('./Log/Log.js');
var conf = new config();
var datetime = require('node-datetime');
var cron = require('node-cron');
var nconf = require('nconf');
var shopifyJobFrequency = conf.parameters().shopifyJobFrequency ;





var onJobStarted = function()
{
	nconf.use('file', { file: './ConfigDate/DateTimeLastSync.json' });
	nconf.load();

    var date = new Date();
	
	log.WriteLog("Message",'Shopify Job Sync started on \t' + date,true,true);
	 
	
	var dateInitial = "";

	if(nconf.get('lastUpdateShopify')!=="")
	{
		dateInitial = nconf.get('lastUpdateShopify');
	}
	else
	{
		dateInitial = conf.parameters().initialDateTimeShopify;
	}
	
		
	

	var lastUpdated = 
	{
	  created_at_min : dateInitial,
	  timezone :conf.parameters().timezone,
	  limit: conf.parameters().limitShopify
	};

	//'01/06/2017 4:52:48 PM',

	shopifyData.getTimeZone(function(resultTimeZone)
	{	
		if(resultTimeZone.Result.Success) 
		{
			if(resultTimeZone.Result.TimeZone !== "")
			{
				lastUpdated.timezone = resultTimeZone.Result.TimeZone
			} 
			
			shopifyDataConSync.syncDataRetry(lastUpdated);
		}
	});
};


cron.schedule(shopifyJobFrequency, onJobStarted,true);







