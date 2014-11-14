include("led.js");

var duration = 0;
var nextEarsMove = 5000
var timeoutEarz = 0;


karotz.connectAndStart = function(host, port, callback, data){	
    try{
        karotz.connect(host, port);
    	log("connected");
    	karotz.start(callback, data);
    }catch(err){
    	log(err);
    }
};

//earsPos=new Array(-3,5);
var randomEars = function(event){
  log("randomEars");
  if (timeoutEarz>=100){
    nextEarsMove = 30000+Math.floor(Math.random()*25);
    log("REDUCESPEED")
  }
  else timeoutEarz += 1;
  
  var er=Math.floor(Math.random()*15 - Math.random()*15);
  var el=Math.floor(Math.random()*15 - Math.random()*15);
  if (Math.abs(er)< 5) er = null;
  if (Math.abs(el)< 5) el = null;
 /* if (er == null && el == null){
    er=earsPos[Math.round(karotz.random())];
    el=earsPos[Math.round(karotz.random())];
    karotz.ears.move(er,el);  
  }*/

  karotz.ears.moveRelative(er,el);

  //var nxtdate = Math.floor(karotz.random()*80000+3000);
  setTimeout(nextEarsMove+Math.floor(Math.random()*4), randomEars);
  return false;
}

var buttonListener = function(event)
{
    if(event == "SIMPLE")
    {
       nextEarsMove = 5000
       karotz.ears.moveRelative(5,5)
       timeoutEarz = 0
    }
    if(event == "DOUBLE")
    {
       karotz.multimedia.stop(exit);
    }
    return true;
}

var music = function(){
  karotz.multimedia.play("http://listen.radionomy.com/healing-music-radio.m3u"); // http://zenradio.fr:8800
}

var multimediaListener = function(action)
{
    log("multi callback. action : " + action);

    switch (action)
    {
        case "STOP":
            music();
            break;
        default:
            break;
    }

    return true;
}

var onKarotzConnect = function(data){
  karotz.button.addListener(buttonListener);
  karotz.multimedia.addListener(multimediaListener);

  music();

  rndLed();
  setTimeout(2000, randomEars);
  setTimeout(4000, rndLedCb);
  

  if(duration > 0)
  {
    setTimeout(duration * 60000,  function(){ log("exit"); exit(); return false; });
  }
}

duration = params[instanceName].duration;

var data = {};
karotz.connectAndStart("localhost", 9123, onKarotzConnect, data);
