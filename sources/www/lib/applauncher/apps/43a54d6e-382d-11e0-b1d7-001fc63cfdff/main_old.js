include("dom.js");
include("util.js");
include("url.js");
include("data.js");

var regSpace=new RegExp(" ", "g");
var regBalise=new RegExp("<[^<>]*(>)", "g");

var regBadBalise=new RegExp("<[a-zA-Z0-9]*:[^>]*(/>)", "g");

var regLink=new RegExp("can be found here: ", "g");

var regCharAmp=new RegExp("&amp;", "g");

var availableLang = new Array("fr", "en", "de", "es");

var parser = new DOMParser();
var xmlRss;
var items;
var saveDate;
var lastDate;
var curTitle = "";
var curDesc = "";
var curDate = "";

var currentPos = 0;

var convertTxt = function(txt){
    tmpTxt = txt;
    tmpTxt = tmpTxt.replace(regCharAmp, "&");
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
        //TODO update last-readed date
        readRss();
        return false;
    }
    return true;
}
var ttsTitleCallback = function(event){
    log("rssReader ttsTitleCallback : " + event);
    if((event == "CANCELLED") || (event == "TERMINATED"))
    {
            //lastDate = new Date(curDate);
            //log("json save");
            //JSON.save("lastReadDate", curDate)
        //if(gotoNext == true)
        //{
            //TODO save last date
            //readRss();
        //}
        //else
        //{
            karotz.tts.start(curDesc, lang, ttsDescCallback);
        //}
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
    var tmpDate;
    var tmpPos = -1;
    
    //saveDate = JSON.load("lastReadDate");
   // if(saveDate == undefined)
   ///    log("saveDate : undefined");
        saveDate = new Date("1 Jan 2009 00:00:42");
  //// else
   // {
   //     saveDate = new Date(saveDate);
   // }
/*
    log("saveDate : " + saveDate);
    for (var j=0; j<items.length; j++) {

        //TODO voir autres balises de dates
        tmpDate = items[j].getElementsByTagName("pubDate");

        if(tmpDate == null)
        {
         //   return -1;
        }

        var tmpDateTxt = tmpDate[0].firstChild.nodeValue; 
        log("getLastNonReadedPos tmpDateTxt : " + tmpDateTxt);
        var tmpDateSplit = tmpDateTxt.split(regSpace);
/*        tmpDateTxt = "";

        for (var i=0; i<tmpDateSplit.length; i++) {
            //log("tmpDateSplit " + i + ":" +  tmpDateSplit[i]);
            if(i > 0)
            {
                tmpDateTxt += tmpDateSplit[i] + " ";
            }
        }
        log("getLastNonReadedPos tmpDateTxt : " + tmpDateTxt);
        */
        //TODO utiliser date stockée
        //saveDate = new Date("14 Nov 2010 12:11:00 +0100");
       /* tmpDate2 = new Date(tmpDateTxt);

        log("getLastNonReadedPos  saveDate : " + saveDate);
        log("getLastNonReadedPos  tmpDate2 : " + tmpDate2);

        if(saveDate < tmpDate2)
        {
            log("getLastNonReadedPos <");
            tmpPos = j;
        }
        else if(saveDate >= tmpDate2)
        {
            log("getLastNonReadedPos >");
            break;
        }
        //log("getLastNonReadedPos pos = " + tmpPos);
    }
    log("getLastNonReadedPos pos = " + tmpPos);*/
    return (items.length -1);
}

//from last non-readed item TO newest item
var readRss = function(){
    if(currentPos < 0)
    {
        log("readRss. end of list reached");
        endOfRSS();
        return;
    }
    tmpTitle = items[currentPos].getElementsByTagName("title");
    tmpDesc = items[currentPos].getElementsByTagName("description");
    tmpDate = items[currentPos].getElementsByTagName("pubDate");

    if((tmpTitle.length > 0) && (tmpDesc.length > 0) && (tmpDate.length > 0))
    {
        curTitle = tmpTitle[0].firstChild.nodeValue;
        log("readRss. title : " + curTitle);

        curDesc = tmpDesc[0].firstChild.nodeValue;
        //log("readRss. description : " + curDesc);
        curDesc = convertTxt(curDesc);
        log("readRss. description : " + curDesc);

        curDate = tmpDate[0].firstChild.nodeValue;
        log("readRss. date : " + curDate);
        karotz.tts.start(curTitle, lang, ttsTitleCallback);
    }
    else
    {
        log("readRss. error reading title/description");
    }

    currentPos--;
}

var onKarotzConnect = function(data){
    log("rss title : items done ####");
    karotz.led.light("000000");
    karotz.led.pulse("00FFFF", 800, -1);

    var dataXml = http.get(urlRss);

    var newLink = "";
    var testLink = regLink.test(dataXml);

    if(testLink == true)
    {
        log("######### testLink true");

        dataXml = dataXml.split(regLink);
        newLink = dataXml[1];
        dataXml = http.get(newLink);
    }

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
