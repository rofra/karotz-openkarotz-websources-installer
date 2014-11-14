include("util.js");

log("loaded");


var q;

var karotz_ip="localhost";

var reg=new RegExp("\W", "g");

var buttonListener = function(event) {
    if (event == "DOUBLE") {
        karotz.tts.stop();
        exit();
    }
    return true;
}

var nextQuestion = function(event) {
    if((event == "CANCELLED") || (event == "TERMINATED")) {
        setTimeout(1000, function(){askQuestion(getQuestion())});
    }
    return true;
}


var getQuestion = function(){
    var questionRaw = http.get("http://www.jcheype.com:9090/");
    var q = JSON.parse(questionRaw);
    log("############## question: " + q.question);
    log("############## response: " + q.responses);
    return q;
}

var questionToTTS = function(q){
    var text = "catégorie " + q.category + ". " + q.question + ".\n";
    text += "A. " + q.responses["choix1"] + ".\n";
    text += "B. " + q.responses["choix2"] + ".\n";
    text += "C. " + q.responses["choix3"] + ".\n";
    
    return text;
}

var questionToASR = function(q){
    var text = "";
    text += "(A|[A] " + q.responses["choix1"].replace(reg," ") + ') {$="choix1"} |';
    text += "(B|[B] " + q.responses["choix2"].replace(reg," ") + ') {$="choix2"} |';
    text += "(C|[C] " + q.responses["choix3"].replace(reg," ") + ') {$="choix3"}';
    
    return text;
}

var askQuestion=function(q){
    karotz.tts.start(questionToTTS(q), "fr", function(event){
        if((event == "CANCELLED") || (event == "TERMINATED")) {
                karotz.asr.string(questionToASR(q),  "fr-FR",  function(asrResult){
                    var text = asrResult.text;
                    if(text == "<nomatch>")
                        setTimeout(6000, function(){askQuestion(getQuestion())});
                        
                    else if(asrResult.semantic.indexOf(q.good) == -1)
                        karotz.tts.start("non, la réponse est: " + q.responses[q.good], "fr", nextQuestion);
                    else
                        karotz.tts.start("oui, la réponse est bien: " + q.responses[q.good], "fr", nextQuestion);
                    
                    return false;
                });
        }
    });   
    return false;
}

var onKarotzConnect = function(data) {
    karotz.button.addListener(buttonListener);
    askQuestion(getQuestion());
}

karotz.connectAndStart(karotz_ip, 9123, onKarotzConnect, {});
