include("util.js");
var karotz_ip = "localhost";//<= ATTENTION : ici votre adresse IP !29 jessica, 96 dany, 46 papa
var num_son;

//params[instanceName].musique "oui" "non"
//params[instanceName].phrase => 0 = au hasard sinon prendre le numero
var buttonListener = function(event) {
    if (event == "DOUBLE") {
        karotz.tts.stop();
        exit();
    }
        if (event == "SIMPLE") {
        karotz.multimedia.stop(attendre);
    }
    return true;
}

var event3 = function(event) {
  if ((event == "TERMINATED") || (event == "CANCELLED")) {  
  exit();  
  }
  return true;

}
var event2 = function(event) {
  if ((event == "TERMINATED") || (event == "CANCELLED")) { 
  //setTimeout(1000, function() { choisis_ta_table("TERMINATED") });
      karotz.multimedia.play("/usr/karotz/apps/2c404a81-4c15-4aa9-8361-a8369c5aa9c0/300.mp3", event3);
  }
  return true;

}
var event1 = function(event) {
  if ((event == "TERMINATED") || (event == "CANCELLED")) {  
  karotz.multimedia.play("http://www.bregeon.net/kaamelott/" + num_son + ".ape", event2);;  
  }
  return true;

}
var onKarotzConnect = function(data) {
    karotz.button.addListener(buttonListener);
    num_son = 1 + Math.floor(Math.random() * 298);
    if (params[instanceName].phrase != 0){num_son = params[instanceName].phrase;};
    if (params[instanceName].musique == "non"){  karotz.multimedia.play("http://www.bregeon.net/kaamelott/" + num_son + ".ape", event3);};
    if (params[instanceName].musique == "oui") { karotz.multimedia.play("/usr/karotz/apps/2c404a81-4c15-4aa9-8361-a8369c5aa9c0/302.mp3", event1); };  

}
   

karotz.connectAndStart(karotz_ip, 9123, onKarotzConnect, {});

//http://www.universal-soundbank.com/mp3/sounds/10648.mp3

