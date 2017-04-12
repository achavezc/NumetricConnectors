//   You put the mat down, and then you jump to conclusions
module.exports = require('./lib/mixpanel');
mixpanel = require('./lib/mixpanel');
const config = require("./../../Config/Config")
var conf = new config();
//ddss
var configMixPanel = {};
configMixPanel.apiSecretMixPanel = undefined;
const utils = require("./../../Helper/Util")


var mx = new mixpanel({
    api_secret: conf.parameters().apiSecretMixPanel// configMixPanel.apiSecretMixPanel
});


//lastUpdated = {
  //from_date : '2017-03-11',
  //to_date : '2017-03-12'
//}


var getEvents =  function getEvents(lastUpdated,callback)
{
				utils.WriteFileTxt("\r\n");
				utils.WriteFileTxt("getEvents");		
				utils.WriteFileTxt("\r\n");
			
                var resultEvent = {};
                resultEvent.Result = {}
                resultEvent.Result.Success = false;
                resultEvent.Result.Data = [];

                mx.export_data({ from_date: lastUpdated.from_date, to_date: lastUpdated.to_date }, function(res) {
                    res.on('data', function(event_object) 
					{
						utils.WriteFileTxt("getEvents data");	
                         resultEvent.Result.Data.push(event_object);
                    });
                    res.on('end', function() {
						utils.WriteFileTxt("getEvents end");
						utils.WriteFileTxt("\r\n");
						utils.WriteFileTxt(JSON.stringify(resultEvent));
						utils.WriteFileTxt("\r\n");
                        resultEvent.Result.Success = true;
                        callback(resultEvent);
                    });
                    res.on('error', function(err) {
                        resultEvent.Result.Success = false;
                        resultEvent.Result.Error = err;
                        //callback(resultEvent);
                        //return resultEvent;
                    });
                })
}




     


module.exports = {
    getEvents : getEvents//,
    //apiSecretMixPanel: apiSecretMixPanel
};


//module.exports=configMixPanel;