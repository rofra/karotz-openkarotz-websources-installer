include("util.js");

var karotz_ip="localhost"
var json;

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

var sayContent = function(event) {
    if((event == "CANCELLED") || (event == "TERMINATED")) {
        karotz.tts.start(json.appnews.newsitems[0].contents, "en", exitFunction);
    }
    return true;
}

var onKarotzConnect = function(data) {
    karotz.button.addListener(buttonListener);
	var callURL = "http://api.steampowered.com/ISteamNews/GetNewsForApp/v0002/?appid="+params[instanceName].appid+"&count=1&maxlength=600&format=json"
    var data = http.get(callURL);
	json = JSON.parse(data);
	karotz.tts.start(json.appnews.newsitems[0].title, "en", sayContent);
}

karotz.connectAndStart(karotz_ip, 9123, onKarotzConnect, {});
