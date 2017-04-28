const mixpanel = require('mixpanel-data-export-node');

const config = require("./../../Config/Config");
var conf = new config();

var mx;
mx = new mixpanel({
    api_secret: conf.parameters().apiSecretMixPanel
});


var getEvents = function getEvents(lastUpdated) {
    var resultEvent = {};
    resultEvent.Result = {};
    resultEvent.Result.Success = false;
    resultEvent.Result.Data = [];

    return mx.export({
        from_date: lastUpdated.from_date,
        to_date: lastUpdated.to_date
    }).then(function(data) 
	{		
        resultEvent.Result.Success = true;
        resultEvent.Result.Data = data;
        return resultEvent;
    });
};

module.exports = {
    getEvents: getEvents
};