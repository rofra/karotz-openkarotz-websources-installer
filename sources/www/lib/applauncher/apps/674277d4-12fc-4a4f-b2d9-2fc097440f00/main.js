include("util.js");

var karotz_ip="localhost";
if(typeof(test_ip)!="undefined")
      karotz_ip=test_ip;

var buttonListener = function(event) 
{
    if (event == "DOUBLE") 
    {
      karotz.tts.stop();
      exit();
    }
    return true;
}

var exitFunction = function(event) 
{
    if((event == "CANCELLED") || (event == "TERMINATED")) {
        exit();
    }
    return true;
}

var onKarotzConnect = function(data) 
{
    karotz.led.light("FFFFFF");
    karotz.led.pulse("660000", 500, -1);
    karotz.button.addListener(buttonListener);
    
    var weburl = params[instanceName].weburl;
    var txt = http.get(weburl);

    if (txt=="curl error")
      karotz.tts.start("Désolai, Je ne peux pas te donner ce que tu demandes", "fr", exitFunction);
    else
      karotz.tts.start(txt, "fr", exitFunction);
}

karotz.connectAndStart(karotz_ip, 9123, onKarotzConnect, {});
