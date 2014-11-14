include("util.js");


var radiourl = "";
var station = "Radio Nova";


var karotz_ip = "localhost"; //Place your IP address here or change to localhost for embedded version.
//var karotz_ip = "5.5.1.133";
var pause = true;


var myping = function(event){//This feature avoids that the radio stops playing after 15 minutes
    ping();//normally karotz.ping () this doesn't work however on KarotzVM
    setTimeout(600000, function() { myping(); return true; });
}
var yes_no = function(event) {
    if ((event == "CANCELLED") || (event == "TERMINATED")) {
        karotz.asr.string("oui | non", "fr-FR", function(asrResult) {
            var validation = asrResult.text;
            log("############### validation : " + validation);
            if (validation == "<nomatch>")
                karotz.tts.start("Désolé, je ne vous ai pas compris", "fr", chooseStation);
            else if (validation == "non")
                karotz.tts.start("Essayez à nouveau", "fr", chooseStation);
                else if (validation == "<error_server_timeout>")
                        karotz.tts.start("Mon serveur ASR a expiré, désolé, s'il vous plaît essayer à nouveau plus tard", "fr", chooseStation);
       else
           karotz.tts.start("Je vais lancer la radio : " + radio, 'fr', function(event){


    if ((event = "TERMINATED") || (event == "CANCELLED")) {
      if (radio == "Radio Nova")
      {
      radiourl = "http://broadcast.infomaniak.net/radionova-high.mp3";
      }
      if (radio == "MFM")
      {
      radiourl = "http://mfm.ice.infomaniak.ch:80/mfm-128.mp3";
      }
      if (radio == "NRJ")
      {
      radiourl = "http://mp3.live.tv-radio.com/nrj/all/nrj_113225.mp3";
      }

    if (radio == "Le Mouv")
      {
      radiourl = "http://mp3.live.tv-radio.com/lemouv/all/lemouvhautdebit.mp3"
}

if (radio == "Fun Radio")
{
radiourl = "http://streaming.radio.funradio.fr:80/fun-1-44-96";
}

if (radio == "Radio Classique")
{
radiourl = "http://players.creacast.com/creacast/classique/playlist.m3u";
}


     // karotz.button.addListener(buttonListener); //Allows button interruption
        karotz.led.pulse("FFCFAF", 2000, -1); //Pink LED flashes every 2 seconds with an indefinite pulse loop
      karotz.multimedia.play(radiourl);
}});});}}

var chooseStation = function() {
    karotz.tts.start("Radios musicales. Vous pouvez me dire la station que vous souhaitez écouter", "fr", function(event) {
        if ((event == "CANCELLED") || (event == "TERMINATED")) {
            karotz.asr.string("Radio Nova {$='Radio Nova'} | M.F.M. {$='MFM'} | N.R.J. {$='NRJ'} |Le Mouv {$='Le Mouv'} | Fun Radio {$='Fun Radio'} | Radio Classique {$='Radio Classique'}", "fr-FR",
                function(asrResult) {
                    radio = asrResult.semantic;
                    log("######## radio: " + radio);
                    if (asrResult.text == "<nomatch>")
                        karotz.tts.start("Désolé, je ne vous ai pas compris", "fr", chooseStation);
                    else
                        karotz.tts.start("J'ai compris: " + radio + ". est-ce correct? ", "fr", yes_no);
                });
        }
    });
}


var buttonListener = function(event)
{
    if (event == "SIMPLE") {//Support for pause/resume using the button
        karotz.led.light("000000");
        pause = !pause;
        log('pause = : ' + pause);
        if (!pause) {
            log('here : pause = false => pause');
            karotz.led.pulse("75FF00", 500, -1); //Light flashes faster, LED is yellow when pause
            karotz.multimedia.pause(); //Pause Multimedia
        }
        if (pause) {
            log('here : pause = true => resume');

            karotz.led.pulse("FFCFAF", 2000, -1);
            karotz.multimedia.resume(); //Resume Multimedia
        }
    }
    if (event == "DOUBLE") {
        karotz.multimedia.stop();
        exit();
    }
    return true;
}

var onKarotzConnect = function(data){
  karotz.led.light("000000");
  karotz.led.pulse("FFCFAF", 2000, -1); //Pink LED flashes every 2 seconds with an indefinite pulse loop
  karotz.button.addListener(buttonListener); //Allows button interruption
  myping(); //Launches once on application execution, then it will run every 10 minutes

  chooseStation()
}


karotz.connectAndStart(karotz_ip, 9123, onKarotzConnect, {});
