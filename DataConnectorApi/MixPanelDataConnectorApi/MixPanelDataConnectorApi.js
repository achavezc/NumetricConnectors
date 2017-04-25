//   You put the mat down, and then you jump to conclusions
//module.exports = require('./lib/mixpanel');
mixpanel = require('mixpanel-data-export-node') //require('./lib/mixpanel');

const config = require("./../../Config/Config");
var conf = new config();

var configMixPanel = {};
configMixPanel.apiSecretMixPanel = undefined;
const utils = require("./../../Helper/Util");


var mx;
mx = new mixpanel({
    api_secret: conf.parameters().apiSecretMixPanel
});


var getEvents =  function getEvents(lastUpdated)
{		
	var resultEvent = {};
	resultEvent.Result = {};
	resultEvent.Result.Success = false;
	resultEvent.Result.Data = [];
	
	return mx.events({ 
			  from_date: lastUpdated.from_date, 
			  to_date: lastUpdated.to_date 
			 }).then(data=>{
	   resultEvent.Result.Success = true;
	   resultEvent.Result.Data = data;
	   return resultEvent;
	});             
};

module.exports = 
{
    getEvents : getEvents
};

