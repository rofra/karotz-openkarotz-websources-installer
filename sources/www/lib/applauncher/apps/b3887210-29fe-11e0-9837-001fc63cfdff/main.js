include("util.js");
include("data.js");

var regTxtBegin=new RegExp("<p class=\"sp_left sp_right\">", "g");
var regTxtEnd=new RegExp("</p>", "g");

var horoscopeData;
var signe;

var pos = 0;
var currentTxt = "";

function dumpText( s )
{
	var sT = "";
	for ( var idx = 0; idx < 1200; idx++ )
	{
		var c = s.charAt( idx );
		var n = c.charCodeAt( 0 );
		sT += "[" + c + "]=" + n;
	}
	log( sT );
}

var extractHoroscope = function(){
    var tmpSplit;
	// log( "#########extract from : " + horoscopeData[pos + 1] );
    tmpSplit = horoscopeData[pos + 1].split(regTxtEnd);
    var sExtracted = tmpSplit[0];
	// log( "####extracted : " + sExtracted );
    return sExtracted;
}

var quitHoroscope = function(){
    //QUIT
    karotz.tts.stop();
    exit();
}

var ttsCallback2 = function(event){
    log("ttsCallback : " + event);
    if((event == "CANCELLED") || (event == "TERMINATED"))
    {
        pos++;
        read();
        return false;
    }
    return true;
}

var read = function(){
    log("read ########## pos = " + pos + " / length=" + themeString.length );
    if(pos >= themeString.length)
    {
        quitHoroscope();
    }
    currentTxt = extractHoroscope();
    karotz.tts.start(themeString[pos] + " : " + currentTxt, lang, ttsCallback2);
}

var download = function(){
    log("download");
    http.get(baseUrl, read);
}

var buttonListener = function(event)
{
    log("buttonListener : " + event);

    if(event == "DOUBLE")
    {
        quitHoroscope();
    }

    return true;
}

var onKarotzConnect = function(data){
    log("horoscope onKarotzConnect");
    
    karotz.led.light("00ffff");
    karotz.button.addListener(buttonListener);

    horoscopeData = http.get(baseUrl);
    log("onKarotzConnect horoscopeData: " + horoscopeData);
	// dumpText( horoscopeData );

    horoscopeData = horoscopeData.split(regTxtBegin);
	// log( "data : " + horoscopeData.length + " elements" );

    karotz.tts.start(horoscope + nomSigne[signe], lang, read);
}

var initHoroscope = function(){
    var data = {};
    
    signe = params[instanceName].signe; // "taureau"; // 
    log("params signe: " + signe);

    baseUrl = baseUrl + signe + baseUrlPost;
    log("params baseUrl: " + baseUrl);
    
    karotz.connectAndStart(host, port, onKarotzConnect, data);
}

initHoroscope();
