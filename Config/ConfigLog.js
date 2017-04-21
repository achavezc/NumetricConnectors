const ConfigLog = function(){
	this.showConsole=true;
	this.writeFile=false;
	this.nameFile="LogEvents.log";
	this.relativePath=true;
	this.pathFile="../Log";
};

exports = module.exports = ConfigLog;