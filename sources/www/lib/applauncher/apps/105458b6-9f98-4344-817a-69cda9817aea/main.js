include("util.js");
//var karotz_ip="192.168.0.59";
var karotz_ip="localhost";

var buttonListener = function(event) {
    if (event == "DOUBLE") {
        karotz.tts.stop();
        exit();
    }

    return true;
}

var lireProgramme = function()
{
	var chaines = params[instanceName].chaines;

	var data = http.get("http://www.vinceonline.fr/karotz/masoireetele/getdata.php?chaines="+chaines);
	if (data != "")
	{
	karotz.led.light("000000");
	karotz.led.pulse("00FFFF",1500,-1);
	karotz.tts.start(data,"FR-fr",function(event){if (event == "TERMINATED")
							{

								exit();

							}
						}
		);
	}
	else
	{
	karotz.led.light("FF0000");
	karotz.led.pulse("00FFFF",1500,-1);
	karotz.tts.start("Aucune information n'a été trouvée, merci de rééssayer plus tard!","FR-fr",function(event){if (event == "TERMINATED")
							{

								exit();

							}
						}
		);

	}
}

var onKarotzConnect = function(data) {
	karotz.button.addListener(buttonListener);
	karotz.led.light("0000FF");
	karotz.led.pulse("00FFFF",500,-1);
	karotz.tts.start("Ce soir à la télé","FR-fr",function(event){
	if (event == "TERMINATED")
		{
			lireProgramme();
		}
	});


     
}

karotz.connectAndStart(karotz_ip, 9123, onKarotzConnect, {});
