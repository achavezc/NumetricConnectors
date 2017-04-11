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
//const format = require("node.date-time");
var datetime = require('node-datetime');
var nconf = require('nconf');
nconf.use('file', { file: './ConfigDate/DateTimeLastSync.json' });
nconf.load();

//console.log(nconf.get('lastUpdateShopify'));

/*
var dateTime = require('node-datetime');
var dt = dateTime.create();
nconf.set('lastUpdateShopify', new Date(dt.now()));
*/


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
  timezone :conf.parameters().timezone 
}


//var dt = datetime.create();
//var fomratted = dt.format('m/d/Y H:M:S');
  
//console.log(fomratted);
//console.log(new Date(dt.now()).format("MM/DD/Y HH:mm:SS"));
//'01/06/2017 4:52:48 PM',

 

//'01/06/2017 4:52:48 PM',
ShopifyData.getTimeZone(function(resultTimeZone){
	if(resultTimeZone.Result.Success) {
		if(resultTimeZone.Result.TimeZone != ""){
		lastUpdated.timezone = resultTimeZone.Result.TimeZone
		} 
		ShopifyDataConSync.syncDataRetry(lastUpdated);
	}
});






