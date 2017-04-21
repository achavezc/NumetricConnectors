//   You put the mat down, and then you jump to conclusions
module.exports = require('./lib/mixpanel');
mixpanel = require('./lib/mixpanel');

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
	
	return new Promise(function(sendData,sendCatch) 
	{				
		 mx.export_data({ from_date: lastUpdated.from_date, to_date: lastUpdated.to_date }, function(res) 
		 {
			res.on('data', function(event_object)
			{		
				 resultEvent.Result.Data.push(event_object);
			});
			res.on('end', function() 
			{	
				resultEvent.Result.Success = true;
				sendData(resultEvent);
			});
			res.on('error', function(err) 
			{
				resultEvent.Result.Success = false;
				resultEvent.Result.Error = err;
				sendCatch(resultEvent);					
			});
		})
	});                
};

module.exports = 
{
    getEvents : getEvents
};

