var fs = require('fs');
path = require('path');
winston = require('./lib/winston');
configLog = require('../Config/ConfigLog.js');
pathLog='';

var npmTransport = new (winston.transports.Console)({ showLevel: true, align: true , timestamp: true});
var config=new configLog();
var LogAppConnector=function()
{
	if (config.relativePath)
	{
		pathLog = path.join(__dirname, config.pathFile);
	}
	else{
		pathLog=config.pathFile;
	}
	if ( !fs.existsSync( pathLog ) ) 
	{
		// Create the directory if it does not exist
		fs.mkdirSync( pathLog );
	}
}

var LoggApp=new LogAppConnector();


function getFormattedDate(date) 
{
  var year = date.getFullYear();
  var month = (1 + date.getMonth()).toString();
  month = month.length > 1 ? month : '0' + month;
  var day = date.getDate().toString();
  day = day.length > 1 ? day : '0' + day;
  return year + month +  day  ;
}

function getFormattedDateTime(date) 
{
  var year = date.getFullYear();
  var month = (1 + date.getMonth()).toString();
  month = month.length > 1 ? month : '0' + month;
  var day = date.getDate().toString();
  day = day.length > 1 ? day : '0' + day;
  return year + "-" +  month + "-" +  day + " " + date.toLocaleTimeString()   ;
}

function writeLogInternal(title,message,showConsole,writeFile) 
{
   var filename = path.join(pathLog,getFormattedDate(new Date()) + config.nameFile);
    var newMessage=getFormattedDateTime(new Date()) + "\n" + message + "\n";
	
	if (showConsole)
	{
        npmTransport.log(title, message + "\n",null,function(){});
    }
	
    if (writeFile)
	{
        var archiveTransport = new winston.transports.File({
        timestamp: true,
        json: false,
        zippedArchive: false,
        tailable: true,
        dirname: pathLog,
        filename:filename,
        maxsize: 14096,
        maxFiles: 0
        });
        archiveTransport.log(title, message, null, function() {});
    }
}


 exports.WriteLog=function (Title,Message)
 {
	var showConsole = config.showConsole;
	var writeFile = config.writeFile;	
	writeLogInternal(title,message,showConsole,writeFile);
 }   
 
 exports.WriteLog=function (Title,Message,ShowConsole,WriteFile)
 {
	var showConsole = ShowConsole;
	var writeFile = WriteFile;	
	
	if(!config.showConsole)
	{
		showConsole = false;
	}
	
	if(!config.writeFile)
	{
		writeFile = false;
	}
	
	writeLogInternal(Title,Message,showConsole,writeFile);
 }   
 

exports.WriteLogConsole=function (Title,Message)
 {	
	writeLogInternal(Title,Message,true,false);
 }  
 
 exports.WriteLogFile=function (Title,Message)
 {	
	writeLogInternal(Title,Message,false,true);
 } 
 