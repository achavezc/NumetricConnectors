var config = function(Id) { this.datasetId=Id;};

var keyUser='rJuUQBduBXsQGUN9AWmeUgC1SmYBKWISj8FTVrNzjZM%3D';


config.prototype.parameters = function(data){ return {
	keyUser: keyUser,
	apiSecretMixPanel: '447e92839ec3755e52b7c559ebe15d31',
	shopNameShopify : 'alshopping',
    apiKeyShopify : '1d27b7ede1453ec10bfa360eab134478',
    passwordShopify : 'ef0a6f9c267ff5498d1db4aae742273d',

	initialDateTimeMixPanel:'2017-03-05',
	initialDateTimeShopify:'01/06/2017 4:52:48 PM',
	optionsGetDataSet:{
		uri: 'https://api-qa.numetric.com/v2/dataset',
		//port:80,
		//path: '',
		method: 'GET',
		headers:{'Authorization': keyUser},
		json: true
	},
	optionsGetDataSetById:{
		uri: 'https://api-qa.numetric.com/v2/dataset/'+this.datasetId,
		//port:80,
		//path: '',
		method: 'GET',
		headers:{'Authorization': keyUser},
		json: true
	},
	optionsCreateDataSet:{
		uri: 'https://api-qa.numetric.com/v2/dataset',
		//port:80,
		//path: '',
		method: 'POST',
		headers:{'Authorization': keyUser},
		body:data,
		json: true
	},
	optionsUpdateRowsDataSet:{
		uri: 'https://api-qa.numetric.com/v2/dataset/'+this.datasetId+'/rows',
		//port:80,
		//path: '',
		method: 'POST',
		headers:{'Authorization': keyUser},
		body:data,
		json: true
	},
	optionsGetRowsDataSet:{
		uri: 'https://api-qa.numetric.com/v2/dataset/'+this.datasetId+'/rows',
		//port:80,
		//path: '',
		method: 'GET',
		headers:{'Authorization': keyUser},
		json: true
	},
	optionsDeleteRowsDataSet:{
		uri: 'https://api-qa.numetric.com/v2/dataset/'+this.datasetId+'/rows',
		//port:80,
		//path: '',
		method: 'DELETE',
		headers:{'Authorization': keyUser},
		json: true
	},
	operations:[{
      run: function (value) {
        var d = new Date(value);
        var n = d.toISOString();
        return n;
      },
      on: "time"
    }], //aqui se puede configurar valores por defecto en este caso no aplica dont apply
	plantillaJsonDestino: 
	{
	"event":"$.event",
	"distinct_id":"$.properties.distinct_id",
	"time":"$.properties.time",
	"origin":"$.properties.origin",
	"origin_referrer":"$.properties.origin_referrer",
	"initial_referring_domain":"$.properties.$initial_referring_domain",
	"referrer":"$.properties.$referrer",
	"initial_referrer":"$.properties.$initial_referrer",
	"referring_domain":"$.properties.$referring_domain",
	"os":"$.properties.$os",
	"origin_domain":"$.properties.origin_domain",
	"tab":"$.properties.tab",
	"browser":"$.properties.$browser",
	"Project ID":"$.properties.Project ID",
	"mp_country_code":"$.properties.mp_country_code"
	}
}
};

module.exports=config;