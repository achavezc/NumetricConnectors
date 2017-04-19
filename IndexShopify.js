'use strict';

const ShopifyData = require("./DataConnectorApi/ShopifyDataConnectorApi/ShopifyDataDataConnectorApi");
const config = require("./Config/Config");
const utils = require("./Helper/Util");
const ShopifyDataConSync = require("./DataConnectorSync/ShopifyDataConnectorSync");
var conf = new config();
var datetime = require('node-datetime');
var cron = require('node-cron');

var shopifyJobFrequency = conf.parameters().shopifyJobFrequency ;


var onJobStarted = function()
{
	var nconf = require('nconf');
	nconf.use('file', { file: './ConfigDate/DateTimeLastSync.json' });
	nconf.load();

    var date = new Date();
    console.log('Shopify Job Sync started on \t' + date);	
	utils.WriteFileTxt('Shopify Job Sync started on \t' + date);
	
	var dateInitial = "";

	if(nconf.get('lastUpdateShopify')!= "")
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

	ShopifyData.getTimeZone(function(resultTimeZone)
	{	
		if(resultTimeZone.Result.Success) 
		{
			if(resultTimeZone.Result.TimeZone != "")
			{
				lastUpdated.timezone = resultTimeZone.Result.TimeZone
			} 
			
			ShopifyDataConSync.syncDataRetry(lastUpdated);
		}
	});
};


cron.schedule(shopifyJobFrequency, onJobStarted);







