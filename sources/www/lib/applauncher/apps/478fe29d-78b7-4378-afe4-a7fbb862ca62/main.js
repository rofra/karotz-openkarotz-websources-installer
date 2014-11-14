include("util.js");

// var instanceName = "config";
// var params = {
//     "config" : {"line": "all"}
// };

var incidentsRaw = http.get("http://www.incidents-transports.com/api/incidents.json/hour");
var incidents = JSON.parse(incidentsRaw);
log("incidents: " + incidents);

var karotz_ip="localhost"

var buttonListener = function(event) {
    if (event == "DOUBLE") {
        karotz.tts.stop();
        exit();
    }
    return true;
}

var exitFunction = function(event) {
    if((event == "CANCELLED") || (event == "TERMINATED")) {
        exit();
    }
    return true;
}

var onKarotzConnect = function(data) {
    karotz.button.addListener(buttonListener);
    karotz.tts.start(text, "fr", exitFunction);
    
}

var textIncident = function(incident){
    return incident.line.replace("RER", "R E R., ") + ". " + incident.reason;
}

var text = "";
for(var i=0; i<incidents.length; i++){
    if(incidents[i].line == params[instanceName].line || params[instanceName].line == "all"){
            text += textIncident(incidents[i])+".\n";
    }
}

log("text: " + text);

if(text.length > 0){
    text = "Incidents Transport ! " + text;
    karotz.connectAndStart(karotz_ip, 9123, onKarotzConnect, {});
}
else
    exit();
