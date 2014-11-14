//include("vm/constvm.js");
include("const.js");
include("chain.js");
include("util.js");
include("json2.js");
include("trafic.js");


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
    
    var trafic = false;
    var maxtimes = 5;
    var line = null;
    
    if (params[instanceName].trafic == "true")
    {
        trafic = true;
    }
    
    if (params[instanceName].next && !isNaN(params[instanceName].next))
    {
        maxtimes = parseInt(params[instanceName].next);
    }
    
    if (params[instanceName].line && params[instanceName].line != "")
    {
        line = params[instanceName].line.replaceAll(" ", "+");
    }
    
    var station = params[instanceName].station;
    
    read(trafic, station, maxtimes, line);
}

