'use strict'
const NumetricCon = require("./DataConnectorApi/NumetricDataConnectorApi/NumetricDataConnectorApi")
const numetricDataConnectorLogic = require("./DataConnectorLogic/NumetricDataConnectorLogic")
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

MixPanelData.getEvents(lastUpdated,function(resultEvent){	
		  if(result.Result.Success){  
		  	var datasetMixPanel = MixPanelCon.generateDataSetMixPanelAux(result.Result.Data);
		  	var datos = result.Result.Data;

		  	numetricDataConnectorLogic.verifyCreateDatasetNumetric("MixPanelEvent",datasetMixPanel.DataSetList).then(resultEvent=>{
		  		resultEvent.Result.MixPanelEvent = {};
				resultEvent.Result.MixPanelEvent.id =  resultEvent.Result.Id;
				resultEvent.Result.Data = datos;
				MixPanelCon.updateRowsMixPanel(resultEvent.Result);

		  	})
		  }
});