include('util.js');

var karotz_ip='localhost';
var data = {};

var buttonListener = function(event) {
    if (event == 'DOUBLE') {
        karotz.multimedia.stop();
        exit();
    }
    return true;
}

var exitFunction = function(event) {
	log(event);
    if((event == 'CANCELLED') || (event == 'TERMINATED')) {
        exit();
    }
    return true;
}

var onKarotzConnect = function(data) {
    karotz.button.addListener(buttonListener);
	karotz.ears.reset();
	karotz.multimedia.play('http://luxo-lyon.fr/autre/haka.mp3', exitFunction);
	karotz.led.fade('f80302', 4000);
	
	setTimeout(13700, function(){ karotz.ears.moveRelative(4, 4); return false;});		

	var time = 24500;
	for (var i = 0 ; i < 24 ; i++)
	{		
		if (i == 23)
		{
			setTimeout(time, function(){ karotz.ears.move(0, 0); return false;});
		}
		else
		{
			setTimeout(time, function(){ karotz.ears.moveRelative(1, 1); return false;});
		}				
		time = time + 1000;
	}
}

karotz.connectAndStart(karotz_ip, 9123, onKarotzConnect, data);