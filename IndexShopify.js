'use strict'
const NumetricCon = require("./DataConnectorApi/NumetricDataConnectorApi/NumetricDataConnectorApi")
const ShopifyCon = require("./DataConnectorLogic/ShopifyDataConnectorLogic")
const numetricDataConnectorLogic = require("./DataConnectorLogic/NumetricDataConnectorLogic")
const ShopifyData = require("./DataConnectorApi/ShopifyDataConnectorApi/ShopifyDataDataConnectorApi")
const config = require("./Config/Config")
const utils = require("./Helper/Util")
const ShopifyDataConSync = require("./DataConnectorSync/ShopifyDataConnectorSync")
const promiseRetry = require('promise-retry')
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
    console.log('Job started on \t' + date);
	
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
	  created_at_min : conf.parameters().initialDateTimeShopify, //dateInitial,
	  timezone :conf.parameters().timezone 
	}

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
	
    return;
};


//cron.schedule(shopifyJobFrequency, onJobStarted);


var nconf = require('nconf');
nconf.use('file', { file: './ConfigDate/DateTimeLastSync.json' });
nconf.load();
	
var dateInitial = "";

if(nconf.get('lastUpdateShopify')!= "")
{
	dateInitial = nconf.get('lastUpdateShopify');
}
else
{
	dateInitial = conf.parameters().initialDateTimeShopify;
}
	

 return NumetricCon.getDataSetNumetric().then(currentListDataset=>
 {	
	 ShopifyDataConSync.syncDataTransactions(lastUpdated,currentListDataset);
 })


/*

return NumetricCon.getDataSetNumetric().then(currentListDataset=>
{	
	ShopifyDataConSync.syncDataCustomer(lastUpdated,currentListDataset);
})
*/









