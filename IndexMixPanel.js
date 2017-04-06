'use strict'
const NumetricCon = require("./DataConnectorApi/NumetricDataConnectorApi/NumetricDataConnectorApi")
const MixPanelCon = require("./DataConnectorLogic/MixPanelDataConnectorLogic")
const MixPanelData = require("./DataConnectorApi/MixPanelDataConnectorApi/MixPanelDataConnectorApi")
const inputsMixPanel = require("./SampleData/exampleDataMixPanel")
const inputsShopify = require("./SampleData/exampleDataShopify")
const config = require("./Config/Config")

var conf = new config();


var lastUpdated = {
  from_date : conf.parameters().initialDateTimeMixPanel,
  to_date : '2017-04-05'
}


MixPanelData.apiSecretMixPanel = conf.parameters().apiSecretMixPanel;


MixPanelCon.verifyDatasetMixPanel().then(result=>{
	if(result.Result.Success){
		MixPanelData.getEvents(lastUpdated,function(result){	
		  if(result.Result.Success){  
		 	MixPanelCon.updateRowsMixPanel(result.Result.Data);
		  }
		});
	}
});


