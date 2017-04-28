var isFloat = function(jsonProperty) {
    return (!isNaN(jsonProperty) && jsonProperty.toString().indexOf('.') !== -1);
};

var isDate = function(jsonProperty) {
    return !isNaN(Date.parse(jsonProperty));
    //return Date.parse(jsonProperty)!==NaN
};

var isJsonObject = function(jsonProperty) {
    if (jsonProperty !== null) {
        var objectConstructor = {}.constructor;
        return jsonProperty.constructor === objectConstructor;
    } else {
        return false;
    }
};

/**
 * @return {string}
 * @return {string}
 * @return {string}
 * @return {string}
 * @return {string}
 * @return {string}
 * @return {string}
 * @return {string}
 */
var ObtenerTipoDatoJsonObject = function(jsonObject) {
    //var classNameOfThing = '';

    var classNameOfThing = typeof jsonObject;

    if (classNameOfThing === 'number') {
        if (jsonObject % 1 !== 0) {
            classNameOfThing = 'double';
        }
    }

    if (classNameOfThing === 'object' || classNameOfThing === 'string') {
        if (jsonObject === null) {
            classNameOfThing = 'null';
        } else if (isDate(jsonObject) && jsonObject.toString().indexOf('T') !== -1) { //UTC date
            classNameOfThing = 'datetime';
        } else if (isFloat(jsonObject)) {
            classNameOfThing = 'double';
        }
    }

    switch (classNameOfThing) {
        case 'boolean':
            return classNameOfThing;
        case 'function':
            return function() {};
        case 'null':
            return "string";
        case 'number':
            return "integer";
        case 'object':
            return "objeto"; //{};
        case 'string':
            return classNameOfThing;
        case 'datetime':
            return classNameOfThing;
        case 'double':
            return classNameOfThing;
        case 'symbol':
            return Symbol();
        case 'undefined':
            return void 0;
        default:
            return "noc";
    }
};

var isArray = function(jsonProperty) {
    //return (!!jsonProperty) && (jsonProperty.constructor === Array);
    return Object.prototype.toString.call(jsonProperty) === '[object Array]';
};

var isInclude = function(arr, obj) {
    return (arr.indexOf(obj) !== -1);
};

var CreateProp = function(objectBody, propertyName, propertyValue) {
    objectBody[propertyName] = propertyValue;
    return objectBody;
};

/**
 * @return {string}
 * @return {number}
 * @return {string}
 * @return {string}
 * @return {number}
 * @return {null}
 * @return {boolean}
 */
var GetDefaultValue = function(type) {
    if (typeof type !== 'string') throw new TypeError('Type must be a string.');

    // Handle simple types (primitives and plain function/object)
    switch (type) {
        case 'boolean':
            return false;
        case 'function':
            return function() {};
        case 'null':
            return null;
        case 'integer':
            return 0;
        case 'object':
            return {};
        case 'string':
            return "";
        case 'datetime':
            return "";
        case 'double':
            return 0;
        case 'symbol':
            return Symbol();
        case 'undefined':
            return void 0;
        default:
            return "";
    }
    /*
    try {
        // Look for constructor in this or current scope
        var ctor = typeof this[type] === 'function'
                   ? this[type]
                   : eval(type);

        return new ctor;

    // Constructor not found, return new object
    } catch (e) { return {}; }
    */
};

var formatField = function(NameField, ValueField) {

    var BodyJson = {};
    var dataType = ObtenerTipoDatoJsonObject(ValueField);

    var defaultValue = GetDefaultValue(dataType);

    BodyJson = CreateProp(BodyJson, "field", NameField);
    BodyJson = CreateProp(BodyJson, "displayName", NameField);
    BodyJson = CreateProp(BodyJson, "autocomplete", false);
    BodyJson = CreateProp(BodyJson, "type", dataType);

    if (dataType !== 'string') {
        BodyJson = CreateProp(BodyJson, "default", defaultValue);
    }
    return BodyJson;
};

var GenerarFieldListDataSetNumetric = function(inputJson, fieldsName, baseJson, fkName, fkValue, isSingleObj) {


    var fieldsNameActual = fieldsName; //prefixName +
    baseJson[fieldsNameActual] = []; // empty Array, which you can push() values into

    var foreignKeyName = '';
    var foreignKeyValue = null;
    var props = Object.keys(inputJson);
    if (props.length > 0) {
        if (fkName !== null && fkValue !== null) { //if is different of null is a child
            if (!isInclude(props, "id") || !isInclude(props, fieldsName + "_id")) { //search if not contains a common primary key
                var pkName = "id";
                var pkValue;
                if (isSingleObj) {
                    pkValue = fkValue;
                } else {
                    pkValue = fkValue.toString() + inputJson[props[0]];
                }
                baseJson[fieldsNameActual].push(formatField(pkName, pkValue));
                foreignKeyName = fieldsName + pkName;
                foreignKeyValue = pkValue;
            } else {
                foreignKeyName = fieldsName + props[0];
                foreignKeyValue = inputJson[props[0]];
            }
        } else {
            foreignKeyName = fieldsName + props[0];
            foreignKeyValue = inputJson[props[0]];
        }
    }


    for (var prop in inputJson) {

        if (isArray(inputJson[prop])) {

            //se usuara para cuando se obtenga los rows
            //for (var i = 0; i < inputJson[prop].length; i++ ){GenerarFieldListDataSetNumetric(inputJson[prop][i],fieldsName,baseJson,count);}
            if (inputJson[prop].length > 0) {
                if (isJsonObject(inputJson[prop][0])) {
                    //count++;
                    //arguments.callee(inputJson[prop][0],fieldsName,baseJson,count);
                    GenerarFieldListDataSetNumetric(inputJson[prop][0], fieldsName + "_" + prop, baseJson, foreignKeyName, foreignKeyValue, false);
                } else {
                    //if is a simple list of values then transform stringify
                    var newValueProperty = JSON.stringify(inputJson[prop]);
                    baseJson[fieldsNameActual].push(formatField(prop, newValueProperty));
                }
            }
        } else if (isJsonObject(inputJson[prop])) {

            //if is an JsonObject try generate a particular dataset for him
            GenerarFieldListDataSetNumetric(inputJson[prop], fieldsName + "_" + prop, baseJson, foreignKeyName, foreignKeyValue, true);
        } else {

            baseJson[fieldsNameActual].push(formatField(prop, inputJson[prop]));
        }
    }


    if (fkName !== null && fkValue !== null) {
        baseJson[fieldsNameActual].push(formatField(fkName, fkValue));
    }
};

var GenerateDataSetsNumetricFromShopify = function(inputDataShopify, category, namePK, fieldsName) {

    var JsonResult = {};
    JsonResult.DataSetList = [];
    var JsonFieldsList = {};
    //var fieldsName;
    var props = Object.keys(inputDataShopify);
    if (props.length > 0) {
        fieldsName = props[0];
    }
    var categories = [];
    categories.push(category);
    //var fieldsName = "Init";
    //var prefixName = "fields";
    var inpuSingleData = inputDataShopify[fieldsName][0];

    var count = 0;

    //inputDataShopify
    GenerarFieldListDataSetNumetric(inpuSingleData, fieldsName, JsonFieldsList, count, null, null, false);


    for (var element in JsonFieldsList) {
        if (JsonFieldsList.hasOwnProperty(element)) {
            var DataSet = {};
            count++;
            DataSet = CreateProp(DataSet, "name", element); //"DataSet"+count+"_"+
            DataSet = CreateProp(DataSet, "fields", JsonFieldsList[element]);
            DataSet = CreateProp(DataSet, "primaryKey", namePK);
            DataSet = CreateProp(DataSet, "categories", categories);
            DataSet = CreateProp(DataSet, "description", "DataSet Shopify Generate Automatic");
            JsonResult.DataSetList.push(DataSet);
        }
    }
    return JsonResult;
};

var GenerateDataSetsNumetricFromMixPanel = function(inputDataMixPanel) {

    var JsonResult = {};
    JsonResult.DataSetList = [];
    var JsonFieldsList = {};
    var fieldsName = "fields";
    var count = 0;

    var categories = ["MixPanel"];


    GenerarFieldListDataSetNumetric(inputDataMixPanel, fieldsName, JsonFieldsList, count, null, null, false);

    count = 0;

    for (var element in JsonFieldsList) {
        if (JsonFieldsList.hasOwnProperty(element)) {
            var DataSet = {};
            count++;
            DataSet = CreateProp(DataSet, "name", "MixPanelEvent");
            DataSet = CreateProp(DataSet, "fields", JsonFieldsList[element]);
            DataSet = CreateProp(DataSet, "primaryKey", "distinct_id");
            DataSet = CreateProp(DataSet, "categories", categories);
            DataSet = CreateProp(DataSet, "description", "MixPanel Event");
            JsonResult.DataSetList.push(DataSet);
        }
    }
    return JsonResult;
};


var GenerateRowsFromMixPanel = function(inputDataMixPanel, jsonRows) {
    var Row = {};
    for (var element in inputDataMixPanel) {
        if (inputDataMixPanel.hasOwnProperty(element)) {
            Row = CreateProp(Row, element, inputDataMixPanel[element]);
        }
    }
    jsonRows.rows.push(Row);
};

var GenerateRowsListFromShopify = function(inputDataShopify, jsonListRows, NameListRows, fkName, fkValue, isSingleObj) {
    //NamesSubList
    var Row = {};
    var foreignKeyName = '';
    var foreignKeyValue = null;
    var props = Object.keys(inputDataShopify);
    if (props.length > 0) {
        if (fkName !== null && fkValue !== null) { //if is different of null is a child
            if (!isInclude(props, "id") && !isInclude(props, NameListRows + "_id")) { //search if not contains a common primary key
                var pkName = "id";
                var pkValue;
                if (isSingleObj) {
                    pkValue = fkValue;
                } else {
                    pkValue = fkValue.toString() + inputDataShopify[props[0]];
                }
                Row = CreateProp(Row, pkName, pkValue);
                foreignKeyName = NameListRows + pkName;
                foreignKeyValue = pkValue;
            } else {
                foreignKeyName = NameListRows + props[0];
                foreignKeyValue = inputDataShopify[props[0]];
            }
        } else {
            foreignKeyName = NameListRows + props[0];
            foreignKeyValue = inputDataShopify[props[0]];
        }
    }

    for (var property in inputDataShopify) {
        if (inputDataShopify.hasOwnProperty(property)) {
            if (isArray(inputDataShopify[property])) {
                //if(isInclude(NamesSubList,property)){

                if (inputDataShopify[property].length > 0 && !isJsonObject(inputDataShopify[property][0])) {
                    Row = CreateProp(Row, property, JSON.stringify(inputDataShopify[property]));
                } else {
                    var newNameListRows = NameListRows + "_" + property;
                    var propsJson = Object.keys(jsonListRows);
                    if (!isInclude(propsJson, newNameListRows)) {
                        console.log();
                        jsonListRows[newNameListRows] = {};
                        jsonListRows[newNameListRows].rows = [];
                    }
                    for (var i = 0; i < inputDataShopify[property].length; i++) {
                        //GenerateRowsListFromShopify(inputDataShopify[property][i],jsonListRows,property,NamesSubList,foreignKeyName,foreignKeyValue);
                        GenerateRowsListFromShopify(inputDataShopify[property][i], jsonListRows, newNameListRows, foreignKeyName, foreignKeyValue, false);
                    }
                }
                //}
            } else if (isJsonObject(inputDataShopify[property])) {
                //if(isInclude(NamesSubList,property)){
                var newNameListRows1 = NameListRows + "_" + property;
                var propsJson1 = Object.keys(jsonListRows);
                if (!isInclude(propsJson1, newNameListRows1)) {
                    jsonListRows[newNameListRows1] = {};
                    jsonListRows[newNameListRows1].rows = [];
                }
                GenerateRowsListFromShopify(inputDataShopify[property], jsonListRows, newNameListRows1, foreignKeyName, foreignKeyValue, true);
                //}
            } else {
                Row = CreateProp(Row, property, inputDataShopify[property]);
            }
        }
    }

    if (fkName !== null && fkValue !== null) {
        Row = CreateProp(Row, fkName, fkValue);
    }

    jsonListRows[NameListRows].rows.push(Row);
};


module.exports = {
    GenerateDataSetsNumetricFromShopify: GenerateDataSetsNumetricFromShopify,
    GenerateDataSetsNumetricFromMixPanel: GenerateDataSetsNumetricFromMixPanel,
    GenerateRowsFromMixPanel: GenerateRowsFromMixPanel,
    GenerateRowsListFromShopify: GenerateRowsListFromShopify,
    isArray: isArray,
    isInclude: isInclude,
    CreateProp: CreateProp
};