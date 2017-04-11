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
var nconf = require('nconf');
nconf.use('file', { file: './ConfigDate/DateTimeLastSync.json' });
nconf.load();

var conf = new config();




var dateInitial = "";
if(nconf.get('lastUpdateMixPanelEvent')!= ""){
	dateInitial = nconf.get('lastUpdateMixPanelEvent');
}else{
	dateInitial = conf.parameters().initialDateTimeMixPanel;
}

var dt = datetime.create();
var fomratted = dt.format('Y/m/d');


var lastUpdated = {
  created_at_min : dateInitial,
  to_date : fomratted
}

MixPanelDataConSync.syncDataRetry(lastUpdated);


