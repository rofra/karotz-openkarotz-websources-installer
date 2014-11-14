var urlRss = "";
var lang = "";

urlRss = params[instanceName].rssUrl;
lang = params[instanceName].lang;

var appliName = instanceName;

var host= "localhost";
var port= 9123;

var finrssLang = new Array();
finrssLang["fr"] = "Fin du flux R S S";
finrssLang["en"] = "End of R S S";
finrssLang["de"] = "R S S Ende";
finrssLang["es"] = "final del flujo";

var txtEndRSS = finrssLang[lang];
