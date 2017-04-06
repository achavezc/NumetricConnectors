'use strict'
const NumetricCon = require("./Helper/Conector/NumetricConnectorApi")
const MixPanelCon = require("./Helper/Conector/MixPanelConnector")
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


/*
MixPanelData.getEvents(lastUpdated,function(result){
			console.log(result);
		});
*/


//delete rows
//NumetricCon.deleteRowsDataSetNumetric("374bdb59-c2ce-49c6-b181-bfd8f6a36c8c",{rows:[1,2,3,4,5,6,7,8,9,10,11,12,13,14],});


//var iMp = new inputsMixPanel()
//grabar datos en dataset mix panel
//updateRowsMixPanel(iMp.datamp);
//updateRowsMixPanel(iMp.inputMixPanel);

//var iS = new inputsShopify(); 
//Grabar datos en datasetEvent
//getRowsShopifyEvent(iS.inputEvent.events);
//Grabar datos en datasetCustomCollection
//getRowsShopifyCustomCollection(iS.inputCustomCollection.custom_collections);
//Grabar datos en datasetComment
//getRowsShopifyComment(iS.inputComment.comments);
//Grabar datos en datasetProduct
//getRowsShopifyProduct(iS.inputProduct.products);

//generar data set
//MixPanel
/*
var conf = new config();
var finalFormatMixPanel = NumetricMixPanelFormat(inputsMixPanel.inputMixPanel)
var datasetmixpanel = utils.GenerateDataSetsNumetricFromMixPanel(finalFormatMixPanel);
//console.log(datasetmixpanel.DataSetList[0])
generateDataSetNumetric(datasetmixpanel.DataSetList[0]);
*/
//Shopify
//var datasetshopify = utils.GenerateDataSetsNumetricFromShopify(iS.inputOrder.orders[0],"id");
//utils.WriteFileTxt(JSON.stringify(datasetshopify));
//console.log(datasetshopify);
//generateDataSetNumetric(datasetsShopify.datasetOrderRefundsTransaction);

//MixPanelCon.generateDataSetMixPanel();
//MixPanelCon.testPreserveValue();
