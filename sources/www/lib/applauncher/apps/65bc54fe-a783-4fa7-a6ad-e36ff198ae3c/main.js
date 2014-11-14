include("util.js");

var karotz_ip = "localhost"
//var karotz_ip = "192.168.1.46"//29 jessica 96 dany 46 papa
//params[instanceName].repeat "oui" "non"
//params[instanceName].playlist => contient le nom de la playlist
var bpause = false; // au départ lecture en cours...

var monping = function(event) {
ping();
log("ping");
setTimeout(600000, function() { monping(); return true; });

}
var buttonListener = function(event) {
log("event du bouton " + event);
//if (event == "SIMPLE") {
  // if (!bpause) { bpause= true;karotz.multimedia.pause();  } else {
    //bpause= false;karotz.multimedia.resume();  }

//}
if ((event == "SIMPLE")&&(!bpause)) { 
    bpause= true;
    karotz.multimedia.pause();  
} 

else if ((event == "SIMPLE") &&(bpause) ){ 
    bpause= false;
    karotz.multimedia.resume();  

}
if (event == "DOUBLE") {
    karotz.multimedia.stop();
    exit();
}
 return true;
}
var attendre = function(event) {
log("attendre " + event);
    if(event == "TERMINATED") {
    //log("stop");
      // onKarotzConnect();
    }
    return true;
    
} 
var mediaListener = function(event) {
log("evenement medialisterner " + event + bpause);
    if((event == "TERMINATED") && (bpause == false) && (params[instanceName].repeat == "non")){exit();}
    if((event == "TERMINATED") && (bpause == false) && (params[instanceName].repeat == "oui")){
    //log("stop");
    karotz.multimedia.play("/mnt/usbkey/" + params[instanceName].playlist,mediaListener);
    }
    return true;
    
}



var onKarotzConnect = function(data) {
    karotz.button.addListener(buttonListener);
    karotz.multimedia.addListener(mediaListener);
    monping();
    karotz.multimedia.play("/mnt/usbkey/" + params[instanceName].playlist,mediaListener);

}

karotz.connectAndStart(karotz_ip, 9123, onKarotzConnect, {});
