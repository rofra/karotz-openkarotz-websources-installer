include('util.js');

var buttonListener = function(event) {
    if ((event=='SIMPLE') || (event=='DOUBLE')) {
		karotz.multimedia.stop();
		exit();
	}
}

var onKarotzConnect = function(data) {
	karotz.led.fade('F8AB23', 5000);
	var path = "http://mp3.live.tv-radio.com/rocfm/all/rocfm-128k.mp3" ;
	karotz.button.addListener(buttonListener);
	karotz.multimedia.play(path,function(event){
          if(event == "TERMINATED"){
                exit();
          }
      var duree = params[instanceName].duree;
	  if (duree==0) {}
	  else
	  {
      	var duree_ms = duree*60*1000;
	  	setTimeout(duree_ms,exit);
	  }
    });
}

var karotz_ip = 'localhost';
var data = {};

karotz.connectAndStart(karotz_ip, 9123, onKarotzConnect, data);