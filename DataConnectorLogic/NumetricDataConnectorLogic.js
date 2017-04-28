'use strict';
const log = require('../Log/Log');
const numetricCon = require('../DataConnectorApi/NumetricDataConnectorApi/NumetricDataConnectorApi');


var verifyCreateManyDatasetNumetric = function(arrDataSetNames, currentListDataSet, dataSetBodys) {
    var actions = arrDataSetNames.map(function(input) {
        return verifyCreateDatasetNumetric(input, dataSetBodys, currentListDataSet);
    });
    return Promise.all(actions);
};


var verifyCreateDatasetNumetric = function(datasetName, data, currentListDataset) //callback
{
    var found = false;
    var resultEvent = {};
    resultEvent.Result = {};
    resultEvent.Result.Success = false;
    resultEvent.Result.datasetName = datasetName;
    resultEvent.Result.Id = '';

    return new Promise(function(sendDataSetId, sendCatch) {
        for (var i = 0; i < currentListDataset.Response.length; i++) {
            if (currentListDataset.Response[i].name === datasetName) {
                found = true;
                resultEvent.Result.Id = currentListDataset.Response[i].id;
                resultEvent.Result.Success = true;
                sendDataSetId(resultEvent);
            }
        }

        if (!found) {
            var datasetBody = SearchDataSet(datasetName, data);

            return numetricCon.generateDataSetNumetric(datasetBody.Data).then(function(res) {
                    if (res.Result.Success) {
                        log.WriteLog('Message', 'Completed Create ' + datasetName + ' Dataset ID:' + res.Response.id, true, true);

                        resultEvent.Result.Id = res.Response.id;
                    }
                    resultEvent.Result.Success = res.Result.Success;
                    sendDataSetId(resultEvent);
                })
                .catch(function(err) {
                    log.WriteLog('Error', 'verifyCreateDatasetNumetric error DataSet ' + datasetName + ' Error:' + err, true, true);

                    sendCatch(err);
                });
        } else {
            log.WriteLog('Message', 'The ' + datasetName + ' Dataset already exists', true, true);

            sendDataSetId(resultEvent);
        }
    });
};

var SearchDataSet = function(datsetName, dataSetList) {
    var found = false;
    var resultEvent = {};
    resultEvent.Result = {};
    resultEvent.Result.Success = false;
    resultEvent.Result.Data = {};

    for (var i = 0; i < dataSetList.length; i++) {
        if (dataSetList[i].name === datsetName) {
            resultEvent.Success = true;
            resultEvent.Data = dataSetList[i];
            return resultEvent;
        }
    }

    if (!found) {
        resultEvent.Success = false;
        return resultEvent;
    }
};


module.exports = {
    verifyCreateManyDatasetNumetric: verifyCreateManyDatasetNumetric
};