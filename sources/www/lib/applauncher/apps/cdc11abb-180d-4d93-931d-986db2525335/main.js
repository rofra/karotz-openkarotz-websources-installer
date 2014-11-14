//include("vm/constvm.js");
include("const.js");
include("util.js");
include("json2.js");
include("meteo.js");


karotz.connectAndStart(karotz_ip, 9123, onKarotzConnect, {});

function buttonListener(event)
{
    if (event == "DOUBLE")
    {
        karotz.tts.stop();
        exit();
    }
    return true;
}

function exitFunction(event)
{
    if((event == "CANCELLED") || (event == "TERMINATED"))
    {
        exit();
    }
    return true;
}

function onKarotzConnect(data)
{
    karotz.button.addListener(buttonListener);
    
    parseMeteo(params[instanceName].code);
    
}

