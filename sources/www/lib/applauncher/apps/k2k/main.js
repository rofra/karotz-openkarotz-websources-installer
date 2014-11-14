include("util.js");

var reg=new RegExp(" ", "g");
var line_split=cmdline.split(reg);
var instanceName = line_split[1];

var ringing = false;

var BLACK = "000000" ;
var PURPLE = "9F00FF" ;

var RECV_INSTANCE_NAME = "%recv%";
var ringPath = "/usr/karotz/res/sounds/linphone_ring.wav"

var k2klistener=function(event){
  log("K2K CALLBACK");
  log(event.type);
  //  log(event.correspondant);
  if (event.type == "TERMINATED"){
    log("hangup");
    karotz.led.fade(BLACK,100, null);
    exit();
  }
  else if (event.type == "BEGINNING")
  {
      log("call beginning");
      karotz.led.fade(BLACK,100,function(event){if(event == "TERMINATED"){karotz.led.pulse(PURPLE, 500, -1);}  });
  }
  return true;
}

var buttonListener = function(event)
{
    if (event == "SIMPLE")
    {
        if (instanceName == RECV_INSTANCE_NAME)
        {
            // accept call
            if (ringing == true)
            {
                log("k2k simple clic -> answering");
                stopRing();
                log("telling k2k to answer");
                karotz.k2k.answer(true);
                log("told k2k to answer");
            } else {
                log("Simple click, but not ringing -> do nothing")
                // do nothing
                ;
            }
        }
        else
        {
            log("Simple click. nothing to do.");
            // simple click while placing a call makes no
            // sense. nothing to do.
        }
    }
    else if(event == "DOUBLE")
    {
        // either abort (incoming or placing) call or ending it.
        log("Double clic -> hangup");
        karotz.k2k.hangup();
        karotz.led.fade(BLACK,100, null);
        exit(); // will reset lights, stop sound, ...
    }
    return true;
}


// rings in loop, while ringing == 1
function startRingback() {
    log("Starting ringback");
    karotz.led.fade(BLACK,100,function(event){if(event == "TERMINATED"){karotz.led.pulse(PURPLE, 300, -1);}  });
    // ringback sound played by linphone
    ringing = true;
}

function stopRingback() {
    log("Stopping ringback");
    ringing = false;
}


function startRingLoop() {
    // rings in loop, while ringing == 1
    log("start ring loop");
    karotz.multimedia.play(ringPath , function(event){if (ringing && (event == "TERMINATED")) {startRingLoop();}}); // should be replaced by playLoop when available
    log("ring loop started");
}

function stopRing() {
    log("stop ring");
    karotz.multimedia.stop();
    ringing = false;
    log("ring stopped");
}

function recvCall() {
    log("incoming call");
    ringing = true;
    karotz.led.fade(BLACK,100,function(event){if(event == "TERMINATED"){karotz.led.pulse(PURPLE, 300, -1);}  });
    startRingLoop();
}

function call(fullNum) {
    log("asked to call this num : " + fullNum);
    var res = karotz.k2k.call(fullNum);
    log(res);
}


var onKarotzConnect = function(data)
{
    log("k2k");
    log("instance name : " + instanceName);

    karotz.k2k.addListener(k2klistener);
    karotz.button.addListener(buttonListener);

    if (instanceName == RECV_INSTANCE_NAME)
    {
        recvCall();
    }
    else // contact configuration
    {
        var number = "sip:" + instanceName + "@sipdev.karotz.com";
        call(number);
    }
}

var data = {};
karotz.connectAndStart("localhost", 9123, onKarotzConnect, data);
