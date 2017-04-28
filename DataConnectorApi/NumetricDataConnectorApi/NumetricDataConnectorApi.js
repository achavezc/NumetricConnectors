const config = require("../../Config/Config");
const rp = require('request-promise');
const log = require('./../../Log/Log.js');

var getDataSetNumetric = function() {
    var conf = new config();
    var resultEvent = {};
    resultEvent.Result = {};
    resultEvent.Result.Success = false;

    return rp(conf.parameters().optionsGetDataSet).then(function(response) {
        resultEvent.Response = response;
        resultEvent.Result.Success = true;
        return resultEvent;
    });
};

var getDataSetNumetricById = function(datasetId) {
    var conf = new config(datasetId);
    var resultEvent = {};
    resultEvent.Result = {};
    resultEvent.Result.Success = false;

    return rp(conf.parameters().optionsGetDataSetById).then(function(response) {
            resultEvent.Response = response;
            resultEvent.Result.Success = true;
            return resultEvent;
        })
        .catch(function(err) {
            resultEvent.Result.Success = false;
            resultEvent.Result.Error = err;
            return resultEvent;
        });
};

var generateDataSetNumetric = function(data) {
    var conf = new config();
    var resultEvent = {};
    resultEvent.Result = {};
    resultEvent.Result.Success = false;

    return rp(conf.parameters(data).optionsCreateDataSet).then(function(response) {

        resultEvent.Response = response;
        resultEvent.Result.Success = true;
        return resultEvent;
    });
};

var updateRowsDataSetNumetric = function(datasetId, data) {
    var conf = new config(datasetId);
    var resultEvent = {};
    resultEvent.Result = {};
    resultEvent.Result.Success = false;


    return rp(conf.parameters(data).optionsUpdateRowsDataSet).then(function(response) {
        resultEvent.Response = response;
        resultEvent.Result.Success = true;
        return resultEvent;
    }).catch(function(err) {
        log.WriteLog('Error', 'UpdateRowsDataSetNumetric error DataSetId ' + datasetId + ' Error:', true, true);
        resultEvent.Result.Success = false;
        resultEvent.Result.Error = err;
        return resultEvent;
    });


};

var getRowsDataSetNumetric = function(datasetId) {
    var conf = new config(datasetId);
    var resultEvent = {};
    resultEvent.Result = {};
    resultEvent.Result.Success = false;

    return rp(conf.parameters().optionsGetRowsDataSet).then(function(response) {
            resultEvent.Response = response;
            resultEvent.Result.Success = true;
            return resultEvent;
        })
        .catch(function(err) {
            log.WriteLog('Error', 'getRowsDataSetNumetric error DataSetId ' + datasetId + ' Error:', true, true);
            resultEvent.Result.Success = false;
            resultEvent.Result.Error = err;
            return resultEvent;
        });
};

var deleteRowsDataSetNumetric = function(datasetId, data) {
    var conf = new config(datasetId);
    var resultEvent = {};
    resultEvent.Result = {};
    resultEvent.Result.Success = false;

    return rp(conf.parameters(data).optionsDeleteRowsDataSet).then(function(response) {
            resultEvent.Response = response;
            resultEvent.Result.Success = true;
            return resultEvent;
        })
        .catch(function(err) {
            resultEvent.Result.Success = false;
            resultEvent.Result.Error = err;
            return resultEvent;
        });
};

module.exports = {
    getDataSetNumetric: getDataSetNumetric,
    getDataSetNumetricById: getDataSetNumetricById,
    generateDataSetNumetric: generateDataSetNumetric,
    updateRowsDataSetNumetric: updateRowsDataSetNumetric,
    getRowsDataSetNumetric: getRowsDataSetNumetric,
    deleteRowsDataSetNumetric: deleteRowsDataSetNumetric
};