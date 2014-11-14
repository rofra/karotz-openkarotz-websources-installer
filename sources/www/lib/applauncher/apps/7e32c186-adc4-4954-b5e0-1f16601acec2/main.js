//include("vm/constvm.js");
include("const.js");
include("util.js");
include("velouz.js");
include("json2.js");

var json;
var ids = new Array();
var currentId = 0;

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
    json = initStations();
    
    loadNextStation();
}


function initStations()
{
    if (params[instanceName].stations)
    {
        ids = params[instanceName].stations.split(',');
        
        karotz.led.pulse("0000FF", 500, -1);
        log("Get "+URL+params[instanceName].stations);
        var data = http.get(URL+params[instanceName].stations);
        log("Received : "+data);
        return JSON.parse(data);
    }
    
    return null;
}

function loadNextStation()
{
    var id = ids[currentId];
    currentId ++;
    
    if (currentId < ids.length)
    {
        loadStation(id, ttsCallback);
    }
    else
    {
        loadStation(id, exitFunction);
    }
}


function ttsCallback(event)
{
    if (event == "TERMINATED")
    {
        loadNextStation();
    }
    else if (event == "CANCELLED")
    {
        exit();
    }
}
