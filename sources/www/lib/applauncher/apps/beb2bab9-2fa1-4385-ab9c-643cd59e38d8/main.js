include("util.js");

//var karotz_ip = "192.168.0.40"
var karotz_ip = "localhost"
var ip = params[instanceName].ip
var port = params[instanceName].port
var lg = "fr"
var grammar = "precedent { $.param='1'} |  [mix de] soire { $.param='2'} | suivant { $.param='3'} | pause { $.param='4'} | eteindre [ordinateur] { $.param='5'} |  mute { $.param='6'} | stope { $.param='7'} | fermer  [X B M C]{ $.param='9'} | quitter [X B M C] { $.param='9'} | [son] plus { $.param='10'} | [son] moin { $.param='11'} | info { $.param='12'} | play { $.param='12'}";

var arrondiSon = function(son){
	var son = http.get("http://"+ip+":"+port+"/xbmcCmds/xbmcHttp?command=GetVolume");
	//log("son : "+son)
	var son2 = son.replace("<li>","").replace("<html>","").replace("</html>","")
	//log("son2 : "+son2)
	var son1=parseInt(son2);
	//log("son1 : "+son1)
	if (son1<=0)
		{sonfinal=0}
	else if (son1>0&&son1<=10)
		{sonfinal=10}
	else if (son1>10&&son1<=20)
		{sonfinal=20}
	else if (son1>20&&son1<=30)
		{sonfinal=30}
	else if (son1>30&&son1<=40)
		{sonfinal=40}
	else if (son1>40&&son1<=50)
		{sonfinal=50}
	else if (son1>50&&son1<=60)
		{sonfinal=60}
	else if (son1>60&&son1<=70)
		{sonfinal=70}
	else if (son1>70&&son1<=80)
		{sonfinal=80}
	else if (son1>80&&son1<=90)
		{sonfinal=90}
	else if (son1>90&&son1<=100)
		{sonfinal=100}
	else if (son1>100)
		{sonfinal=100}
	else 
		{son1=50}
	//log("son1 : "+sonfinal)
}

var KarotzInstruction = function(event) {
	if((event == "CANCELLED") || (event == "TERMINATED")) {
		//log("sonfinal = "+ sonfinal)
		karotz.led.light('0000FF');
		http.post("http://"+ip+":"+port+"/xbmcCmds/xbmcHttp?command=setvolume("+sonfinal+")",{});
		arrondiSon();
								}
					}

var KarotzEcoute = function (data)
{
    karotz.tts.start("XBMC controleur a démaré", "fr");
    karotz.button.addListener(buttonListener);
    karotz.ears.addListener(earsListener); 
    karotz.led.light('0000FF');
    arrondiSon();
}

setTimeout(300000, function(){ log("ping"); ping(); return true; });

var buttonListener = function(event) {
    if (event == "SIMPLE") {
	karotz.led.light('FFA500');
	var data = http.post("http://"+ip+":"+port+"/xbmcCmds/xbmcHttp?command=PlayNext()",{});
	karotz.tts.start("Suivant", "fr", KarotzInstruction);
	}
    if (event == "DOUBLE") {
	karotz.led.light('FFA500');
	karotz.tts.start("Fermeture d' ixe B M C","fr");
	karotz.tts.stop();
	exit();
 	}
    if (event == "LONG_START") {
	karotz.led.light('FFA500');
	var data = http.post("http://"+ip+":"+port+"/xbmcCmds/xbmcHttp?command=setvolume(0)",{});
	detect=0
	karotz.asr.string(grammar,lg,asrResult);


}
	return true;
}
var asrResult = function(asrResult)
{
	if (asrResult.semantic.param == 2) {
		var party = http.post("http://"+ip+":"+port+"/xbmcCmds/xbmcHttp?command=ExecBuiltIn&parameter=%20PlayerControl%28Partymode%29",{});
	
		karotz.tts.start("Mix de soiré activé", "fr", KarotzInstruction);
}
	else if (asrResult.semantic.param == 3) {
		var party = http.post("http://"+ip+":"+port+"/xbmcCmds/xbmcHttp?command=PlayNext()",{});
		karotz.tts.start("média Suivant", "fr", KarotzInstruction);
}	else if (asrResult.semantic.param == 1) {
		var party = http.post("http://"+ip+":"+port+"/xbmcCmds/xbmcHttp?command=PlayPrev()",{});
		karotz.tts.start("média Précédent", "fr", KarotzInstruction);
}
	else if (asrResult.semantic.param == 4) {
		var party = http.post("http://"+ip+":"+port+"/xbmcCmds/xbmcHttp?command=Pause",{});
		karotz.tts.start("Mise en pause du média", "fr", KarotzInstruction);
}
	else if (asrResult.semantic.param == 5) {
		var party = http.post("http://"+ip+":"+port+"/xbmcCmds/xbmcHttp?command=Shutdown()",{});
		karotz.tts.start("Extinction de l'ordinateur", "fr", KarotzInstruction);
		karotz.ttz.stop();
		exit(); 
}	else if (asrResult.semantic.param == 6) {
		var party = http.post("http://"+ip+":"+port+"/xbmcCmds/xbmcHttp?command=Mute()",{});
		karotz.tts.start("Son coupé", "fr", KarotzInstruction);
}	else if (asrResult.semantic.param == 7) {
		var party = http.post("http://"+ip+":"+port+"/xbmcCmds/xbmcHttp?command=Stop()",{});
		karotz.tts.start("Arrèt du média", "fr", KarotzInstruction);
}
	else if (asrResult.semantic.param == 9) {
		var party = http.post("http://"+ip+":"+port+"/xbmcCmds/xbmcHttp?command=Exit()",{});
		karotz.tts.start("Fermeture d' ixe B m C","fr");
		if((event == "CANCELLED") || (event == "TERMINATED")) {	
			exit();						}
}	else if (asrResult.semantic.param == 12) {
		var artiste = http.get("http://"+ip+":"+port+"/xbmcCmds/xbmcHttp?command=GetSystemInfo(202)");
		var song = http.get("http://"+ip+":"+port+"/xbmcCmds/xbmcHttp?command=GetSystemInfo(200)");
		var album = http.get("http://"+ip+":"+port+"/xbmcCmds/xbmcHttp?command=GetSystemInfo(201)");
		karotz.tts.start("En ce moment il y a " + artiste + " qui joue " + song + " extrait de " + album,"fr",KarotzInstruction);
}	else if (asrResult.semantic.param == 10) {
		sonfinal = sonfinal + 10
		var data = http.post("http://"+ip+":"+port+"/xbmcCmds/xbmcHttp?command=setvolume("+sonfinal+")",{});
		karotz.tts.start(sonfinal, "fr", KarotzInstruction);	
}	else if (asrResult.semantic.param == 11) {
		sonfinal = sonfinal - 10
		var data = http.post("http://"+ip+":"+port+"/xbmcCmds/xbmcHttp?command=setvolume("+sonfinal+")",{});
		karotz.tts.start(sonfinal, "fr", KarotzInstruction);	
}		else if (asrResult.semantic.param == 13) {
		var party = http.post("http://"+ip+":"+port+"/xbmcCmds/xbmcHttp?command=Pause",{});
		karotz.tts.start("Lecture du média", "fr", KarotzInstruction);
}

	return true;
}

var earsListener = function(event,step,len){
  karotz.led.light('FFA500');
    if (event.indexOf("STOP_LEFT") >= 0)
    { 

	sonfinal = sonfinal + 10
	var data = http.post("http://"+ip+":"+port+"/xbmcCmds/xbmcHttp?command=setvolume("+sonfinal+")",{});
	karotz.tts.start(sonfinal, "fr",KarotzInstruction);
}

    if (event.indexOf("STOP_RIGHT") >= 0)
    { 

	sonfinal = sonfinal - 10
	var data = http.post("http://"+ip+":"+port+"/xbmcCmds/xbmcHttp?command=setvolume("+sonfinal+")",{});
	karotz.tts.start(sonfinal, "fr",KarotzInstruction);
}

    return true;

}


karotz.connectAndStart(karotz_ip, 9123, KarotzEcoute, {});
