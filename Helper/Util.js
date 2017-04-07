
'use strict'

const fs = require('fs')


var isFloat = function(jsonProperty){
	return (!isNaN(jsonProperty) && jsonProperty.toString().indexOf('.') !== -1)
}

var isDate = function(jsonProperty){
	return !isNaN(Date.parse(jsonProperty))
	//return Date.parse(jsonProperty)!==NaN
}

var isJsonObject = function(jsonProperty){
	if(jsonProperty !== null){
	var objectConstructor = {}.constructor;
	return jsonProperty.constructor === objectConstructor
	}else{
		return false;
	}
}

var ObtenerTipoDatoJsonObject = function (jsonObject){
var classNameOfThing = '';

if(jsonObject==null){
	classNameOfThing = 'null';
}else if(isDate(jsonObject)){
	classNameOfThing = 'datetime';
}else if(isFloat(jsonObject)){
	classNameOfThing = 'double';
}else{
	classNameOfThing = typeof jsonObject;
}

switch (classNameOfThing) {
        case 'boolean'   : return classNameOfThing;
        case 'function'  : return function () {};
        case 'null'      : return "string";
        case 'number'    : return "integer";
        case 'object'    : return "objeto";//{};
        case 'string'    : return classNameOfThing;
        case 'datetime'  : return classNameOfThing;
        case 'double'    : return classNameOfThing;
        case 'symbol'    : return Symbol();
        case 'undefined' : return void 0;
        default : return "noc";
    }
}

var isArray = function (jsonProperty) {
	//return (!!jsonProperty) && (jsonProperty.constructor === Array);
    return Object.prototype.toString.call(jsonProperty) === '[object Array]';
}

var isInclude = function (arr,obj) {
    return (arr.indexOf(obj) != -1);
}

var CreateProp = function (objectBody, propertyName, propertyValue)
  {
      objectBody[propertyName] = propertyValue;
      return objectBody;  
  };

var GetDefaultValue = function (type) {
    if (typeof type !== 'string') throw new TypeError('Type must be a string.');

    // Handle simple types (primitives and plain function/object)
    switch (type) {
        case 'boolean'   : return false;
        case 'function'  : return function () {};
        case 'null'      : return null;
        case 'integer'   : return 0;
        case 'object'    : return {};
        case 'string'    : return "";
        case 'datetime'  : return "";
        case 'double'    : return 0;
        case 'symbol'    : return Symbol();
        case 'undefined' : return void 0;
        default : return "";
    }

    try {
        // Look for constructor in this or current scope
        var ctor = typeof this[type] === 'function'
                   ? this[type]
                   : eval(type);

        return new ctor;

    // Constructor not found, return new object
    } catch (e) { return {}; }
}

var GenerarFieldListDataSetNumetric = function (inputJson,fieldsName, baseJson,fkName,fkValue){


var fieldsNameActual = fieldsName; //prefixName +
baseJson[fieldsNameActual] = []; // empty Array, which you can push() values into

var foreignKeyName='';
var foreignKeyValue=null;
var props = Object.keys(inputJson);
	if(props.length>0){
		foreignKeyName = fieldsName+props[0];
		foreignKeyValue = inputJson[props[0]]; 
	}


	for ( var prop in inputJson ) {

	    if(isArray(inputJson[prop])) {
	    	//se usuara para cuando se obtenga los rows
	    	//for (var i = 0; i < inputJson[prop].length; i++ ){GenerarFieldListDataSetNumetric(inputJson[prop][i],fieldsName,baseJson,count);}
	    	if(inputJson[prop].length>0){
	    		if(isJsonObject(inputJson[prop][0])){
	    		//count++;
	    		//arguments.callee(inputJson[prop][0],fieldsName,baseJson,count);
	    		GenerarFieldListDataSetNumetric(inputJson[prop][0],fieldsName+"_"+prop,baseJson,foreignKeyName,foreignKeyValue);
	    		}else{
	    			//if is a simple list of values then transform stringify
	    			var BodyJson = {};
	    			var newValueProperty = JSON.stringify(inputJson[prop]);
			    	var dataType = ObtenerTipoDatoJsonObject(newValueProperty);
			    	var defaultValue = GetDefaultValue(dataType);
			    	BodyJson = CreateProp(BodyJson,"field",prop);
			    	BodyJson = CreateProp(BodyJson,"displayName",prop);
			    	BodyJson = CreateProp(BodyJson,"autocomplete",false);
			    	BodyJson = CreateProp(BodyJson,"type",dataType);
			    	if(dataType !=='string'||dataType !=='datetime'){BodyJson = CreateProp(BodyJson,"default",defaultValue)};
			    	baseJson[fieldsNameActual].push(BodyJson);
	    		}
	    	}
	    } else if(isJsonObject(inputJson[prop])){
	    	//if is an JsonObject try generate a particular dataset for him
	    	GenerarFieldListDataSetNumetric(inputJson[prop],fieldsName+"_"+prop,baseJson,foreignKeyName,foreignKeyValue);
	    }
	    else {
	    	var BodyJson = {};
	    	var dataType = ObtenerTipoDatoJsonObject(inputJson[prop]);
	    	var defaultValue = GetDefaultValue(dataType);
	    	BodyJson = CreateProp(BodyJson,"field",prop);
	    	BodyJson = CreateProp(BodyJson,"displayName",prop);
	    	BodyJson = CreateProp(BodyJson,"autocomplete",false);
	    	BodyJson = CreateProp(BodyJson,"type",dataType);
	    	if(dataType !=='string'||dataType !=='datetime'){BodyJson = CreateProp(BodyJson,"default",defaultValue)};
	    	baseJson[fieldsNameActual].push(BodyJson);
	    }
	}

if(fkName !==null && fkValue !== null){
	var BodyJson = {};
	    	var dataType = ObtenerTipoDatoJsonObject(fkValue);
	    	var defaultValue = GetDefaultValue(dataType);
	    	BodyJson = CreateProp(BodyJson,"field",fkName);
	    	BodyJson = CreateProp(BodyJson,"displayName",fkName);
	    	BodyJson = CreateProp(BodyJson,"autocomplete",false);
	    	BodyJson = CreateProp(BodyJson,"type",dataType);
	    	if(dataType !=='string'){BodyJson = CreateProp(BodyJson,"default",defaultValue)};
	    	baseJson[fieldsNameActual].push(BodyJson);
	}

}

var GenerateDataSetsNumetricFromShopify = function(inputDataShopify,namePK,fieldsName){

var JsonResult = {};
JsonResult["DataSetList"] = [];
var JsonFieldsList = {};
var fieldsName;
var props = Object.keys(inputDataShopify);
if(props.length>0){
	fieldsName = props[0]; 
}
//var fieldsName = "Init";
//var prefixName = "fields";
var inpuSingleData = inputDataShopify[fieldsName][0];

var count =0;

//inputDataShopify
GenerarFieldListDataSetNumetric(inpuSingleData,fieldsName,JsonFieldsList,count,null,null);


	for(var element in JsonFieldsList){
		var DataSet = {};
		count++;
		DataSet = CreateProp(DataSet,"name",element); //"DataSet"+count+"_"+
		DataSet = CreateProp(DataSet,"fields",JsonFieldsList[element]);
		DataSet = CreateProp(DataSet,"primaryKey",namePK);
	    DataSet = CreateProp(DataSet,"description","DataSet Shopify Generate Automatic");
	    JsonResult["DataSetList"].push(DataSet);
	}
return JsonResult;
}

var GenerateDataSetsNumetricFromMixPanel = function(inputDataMixPanel){

var JsonResult = {};
JsonResult["DataSetList"] = [];
var JsonFieldsList = {};
var fieldsName = "fields";
var count =0;

GenerarFieldListDataSetNumetric(inputDataMixPanel, fieldsName, JsonFieldsList,count);
count =0;

	for(var element in JsonFieldsList){
		var DataSet = {};
		count++;
		DataSet = CreateProp(DataSet,"name","DataSet"+count);
		DataSet = CreateProp(DataSet,"fields",JsonFieldsList[element]);
		DataSet = CreateProp(DataSet,"primaryKey","distinct_id");
	    DataSet = CreateProp(DataSet,"description","DataSet Mix Panel Generate Automatic");
	    JsonResult["DataSetList"].push(DataSet);
	}
return JsonResult;
}


var GenerateRowsFromMixPanel = function(inputDataMixPanel,jsonRows){	
	var Row = {};
		for(var element in inputDataMixPanel){

			Row = CreateProp(Row,element,inputDataMixPanel[element]);

		}
		jsonRows["rows"].push(Row);
}

var GenerateRowsListFromShopify= function(inputDataShopify,jsonListRows,NameListRows,fkName,fkValue){
	//NamesSubList
	var Row = {};
	var foreignKeyName='';
	var foreignKeyValue=null;

	var props = Object.keys(inputDataShopify);
	if(props.length>0){
		foreignKeyName = NameListRows+props[0];
		foreignKeyValue = inputDataShopify[props[0]]; 
	}

	for(var property in inputDataShopify){

		if(isArray(inputDataShopify[property])){
			//if(isInclude(NamesSubList,property)){

				if(inputDataShopify[property].length>0 && !isJsonObject(inputDataShopify[property][0])){
					Row = CreateProp(Row,property,JSON.stringify(inputDataShopify[property]));
				}
				else{
					var newNameListRows = NameListRows+"_"+property;
					jsonListRows[newNameListRows] = {};
					jsonListRows[newNameListRows]["rows"]=[];
					for (var i = 0; i < inputDataShopify[property].length; i++ ){
						//GenerateRowsListFromShopify(inputDataShopify[property][i],jsonListRows,property,NamesSubList,foreignKeyName,foreignKeyValue);
						GenerateRowsListFromShopify(inputDataShopify[property][i],jsonListRows,newNameListRows,foreignKeyName,foreignKeyValue);
					}
				}
			//}
		} else if(isJsonObject(inputDataShopify[property])){
			//if(isInclude(NamesSubList,property)){
				var newNameListRows = NameListRows+"_"+property;
				jsonListRows[newNameListRows] = {};
				jsonListRows[newNameListRows]["rows"]=[];
				GenerateRowsListFromShopify(inputDataShopify[property],jsonListRows,newNameListRows,foreignKeyName,foreignKeyValue);
			//}
		}
		else{
			Row = CreateProp(Row,property,inputDataShopify[property]);
		}
	}

	if(fkName !==null && fkValue !== null){
		Row = CreateProp(Row,fkName,fkValue);
	}

	jsonListRows[NameListRows].rows.push(Row);
}

var WriteFileTxt = function(dataWrite){
var logger = fs.createWriteStream('datasets.txt', {
  flags: 'a' // 'a' means appending (old data will be preserved)
});
logger.write("\r\n");
logger.write(dataWrite);
logger.end();
}

module.exports = {
 GenerateDataSetsNumetricFromShopify : GenerateDataSetsNumetricFromShopify,
 GenerateDataSetsNumetricFromMixPanel : GenerateDataSetsNumetricFromMixPanel,
 GenerateRowsFromMixPanel : GenerateRowsFromMixPanel,
 GenerateRowsListFromShopify : GenerateRowsListFromShopify,
 isArray : isArray,
 WriteFileTxt : WriteFileTxt
}