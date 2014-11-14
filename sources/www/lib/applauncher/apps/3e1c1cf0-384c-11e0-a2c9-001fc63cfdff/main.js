include("dom.js");
include("util.js");
include("url.js");
include("data.js");

var regSpace=new RegExp(" ", "g");
var regBalise=new RegExp("<[^<>]*(>)", "g");

var regBadBalise=new RegExp("<[a-zA-Z0-9]*:[^>]*(/>)", "g");

var regCharAmp=new RegExp("&amp;", "g");
var regCharBalise=new RegExp("&#60;", "g");
var regCharGuil=new RegExp("&#039;", "g");

var availableLang = new Array("fr", "en", "de", "es");

var parser = new DOMParser();
var xmlRss;
var items;
var curTitle = "";
var curDesc = "";

var currentPos = 0;
var maxPos = params[instanceName].number;
var contentToRead = params[instanceName].content;

var convertTxt = function(txt){
    tmpTxt = txt;
    tmpTxt = tmpTxt.replace(regCharAmp, "&");
    tmpTxt = tmpTxt.replace(regCharBalise, "<");
    tmpTxt = tmpTxt.replace(regCharGuil, "'");

    tmpTxt = tmpTxt.replace(/&lt;/g, "<") ;
    tmpTxt = tmpTxt.replace(/&gt;/g, ">") ;
    tmpTxt = tmpTxt.replace(regBalise, "");
    return tmpTxt;
}

var buttonListener = function(event)
{
    log("buttonListener : " + event);

    if(event == "DOUBLE")
    {   
	    endOfRSS();
        return false;
    }   
    else if(event == "SIMPLE")
    {   
        //Next item
        karotz.tts.stop(ttsStopCallback);
        //As tts thread is killed, there is no call to ttsTitleCallback or ttsDescCallback
    }   
    return true;
}

var ttsStopCallback = function(event){
    log("rssReader ttsStopCallback event : " + event);
    if(event == "OK")
    {
        readRss();
        return false;
    }
    return true;
}

var ttsDescCallback = function(event){
    log("rssReader ttsDescCallbackevent : " + event);
    if((event == "CANCELLED") || (event == "TERMINATED"))
    {
        readRss();
        return false;
    }
    return true;
}
var ttsTitleCallback = function(event){
    log("rssReader ttsTitleCallback : " + event);
    if((event == "CANCELLED") || (event == "TERMINATED"))
    {
        if(contentToRead == 2 && curDesc != "")
        {
            karotz.tts.start(curDesc, lang, ttsDescCallback);
        }
        else
        {
            readRss();
        }
        return false;
    }
    log("rssReader ttsTitleCallback return true ");
    return true
}

var endOfRSS = function(event){
    karotz.tts.stop(function(event){
		if(event == "OK")
		{
		    karotz.tts.start(txtEndRSS, lang, function(event){
			if((event == "CANCELLED") || (event == "TERMINATED")) exit();
		    });
		}
	});
}

var getLastNonReadedPos = function(){
    log("getLastNonReadedPos items.length : " + items.length);
    var tmpPos = -1;

    return 0;
}

//from last non-readed item TO newest item
var readRss = function(){
    if(currentPos >= maxPos)
    {
        log("readRss. end of list reached");
        endOfRSS();
        return;
    }
    tmpTitle = items[currentPos].getElementsByTagName("title");
    tmpDesc = items[currentPos].getElementsByTagName("description");

    if((tmpTitle.length > 0) && (tmpDesc.length > 0))
    {
        curTitle = "";
        if(tmpTitle[0].firstChild != null)
        {
            curTitle = tmpTitle[0].firstChild.nodeValue;
            curTitle = convertTxt(curTitle);
            log("readRss. title : " + curTitle);
        }

        curDesc = "";
        if(tmpDesc[0].firstChild != null)
        {
            curDesc = tmpDesc[0].firstChild.nodeValue;
            curDesc = convertTxt(curDesc);
            log("readRss. description : " + curDesc);
        }
        
        if(curTitle == "")
        {
            currentPos++;
            readRss();
            return;
        }

        karotz.tts.start(curTitle, lang, ttsTitleCallback);
    }
    else
    {
        log("readRss. error reading title/description");
    }

    currentPos++;
}

var onKarotzConnect = function(data){
    log("rss title : items done ####");
    karotz.led.light("000000");
    karotz.led.pulse("00FFFF", 800, -1);

    var dataXml = http.get(urlRss);

    dataXml = dataXml.replace(regBadBalise, "");
    log("rss title : regBadBalise ok");

    xmlRss = parser.parseFromString(dataXml);
    
    log("rss title : readRss. parse ok");

    items = xmlRss.getElementsByTagName('item');
    currentPos = getLastNonReadedPos();
    karotz.button.addListener(buttonListener);

    karotz.led.light("00ffff");
    karotz.tts.start("RSS : " + appliName, lang, function(event){
	if(event == "TERMINATED"){
		readRss();
		return false;
	}
	return true;
    });
}

var initRss = function(){
    var data = {};
    log("initRss");
    karotz.connectAndStart(host, port, onKarotzConnect, data);
}

log("params instanceName: " + instanceName);

log("params URL: " + urlRss);
log("params LANG: " + lang);

initRss();
