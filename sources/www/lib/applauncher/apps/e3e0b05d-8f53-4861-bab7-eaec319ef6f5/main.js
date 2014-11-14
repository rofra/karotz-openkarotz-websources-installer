log("START metro");

karotz.connectAndStart = function(host, port, callback, data){	
    try{
        karotz.connect(host, port);
    	log("connected");
    	karotz.start(callback, data);
    }catch(err){
    	log(err);
    }
};

var data = {};
data.ligne = params[instanceName].ligne;
log("ligne: "+data.ligne);
data.station=params[instanceName].station;
log("station: "+data.station);

var nextTrainSearchOffset = 0;
var nextTrainSearchEnd = 0;
var nextTrain = function(str)
{
    if (nextTrainSearchOffset == 0)
    {
        nextTrainSearchOffset = str.indexOf("<div class=\"line_details\">");
        nextTrainSearchOffset = str.indexOf("<tbody>",nextTrainSearchOffset);
        if (nextTrainSearchOffset < 0) return "none";
	nextTrainSearchEnd = str.indexOf("</tbody>",nextTrainSearchOffset);
        if (nextTrainSearchEnd < 0) return "none";
    }
    var deb = str.indexOf('</td><td>',nextTrainSearchOffset)+9;
    if (deb < 9 || deb >= nextTrainSearchEnd) return "none"
    var fin = str.indexOf('</td>',deb);
    if (fin < 0 || fin >= nextTrainSearchEnd) return "none"
    nextTrainSearchOffset = fin;
    var nextTrain = str.substring(deb,fin);
    var  reg=new  RegExp("mn", "g");
    log(nextTrain)
    nextTrain = nextTrain.replace("mn","min");
    log(nextTrain)
    return nextTrain
}

var onKarotzConnect = function(data){
    log("add buttonListener");
    //karotz.button.addListener(buttonListener);


    var cmd = "http://www.ratp.fr/horaires/fr/ratp/metro/prochains_passages/PP/" + encodeURIComponent(data.station)
    +"/"+encodeURIComponent(data.ligne.split(" ")[0]) 
    +"/"+encodeURIComponent(data.ligne.split(" ")[1])  


//service=next,reseau=metro,referer=station,lineid=M1,directionsens=A,stationname=nation
    log(cmd);
    var str = http.get(cmd);
    //log(str)
    var ret;
    var ret = nextTrain(str);
    var ret2 = nextTrain(str);
    var say;
    if (ret == 'none')
    {
        say = "la station " + data.station + " n'existe pas sur la ligne " + data.ligne.split(" ")[0];
    }
    else
    { 
    if (ret.indexOf("min") > 0 )
        ret = ", prochain métro dans "+ret ;
    else
        ret = ", " + ret;
    if (ret2.indexOf("min") > 0 )
        ret2 = ". Le suivant dans "+ret2 ;
    else
        ret2 = ", le suivant " + ret2;
    say = "station "+ data.station + ret + ret2;
    }
    karotz.tts.start(say,"fr",function(event){
			if(event == "TERMINATED"){
				karotz.stop();
				log("exiting...");
				exit();
			}
		});
  
}

log("connect and start");
karotz.connectAndStart("localhost", 9123, onKarotzConnect, data);
