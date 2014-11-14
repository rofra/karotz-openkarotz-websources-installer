//include("vm/constvm.js");
include("const.js");
include("util.js");
include("chain.js");
include("json2.js");
include("reader.js");
include("live.js");
include("foot.js");


karotz.connectAndStart(karotz_ip, 9123, onKarotzConnect, {});


// Not used
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
        log("Stopping application");
        exit();
    }
    return true;
}

function onKarotzConnect(data)
{
    logNow("START");
    
    //karotz.button.addListener(buttonListener);
    
    var footParams = new SportParameters();
    footParams.filter = params[instanceName].footFilter;
    var sound = true;
    
    log("foot filter ="+footParams.filter);
    
    if (params[instanceName].footLive && params[instanceName].footLive == "false")
    {
        footParams.live = false;
    }
    
    if (params[instanceName].footStartupTerminated && params[instanceName].footStartupTerminated == "false")
    {
        footParams.startupTerminated = false;
    }
    
    if (params[instanceName].footStartupPlaying && params[instanceName].footStartupPlaying == "false")
    {
        footParams.startupPlaying = false;
    }
    
    if (params[instanceName].footStartupScheduled && params[instanceName].footStartupScheduled == "false")
    {
        footParams.startupScheduled = false;
    }
    
    if (params[instanceName].sound && params[instanceName].sound == "false")
    {
        sound = false;
    }
    
    startLive(sound, footParams);
}


function SportParameters()
{
   this.live = true;
   this.filter = null;
   this.startupTerminated = true;
   this.startupPlaying = true;
   this.startupScheduled = true;
}

