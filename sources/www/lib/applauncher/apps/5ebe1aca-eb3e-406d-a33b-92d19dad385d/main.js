include("util.js");
include("tinyxmldom.js");
include("exlog.js");
include("planetedomo.js");

var karotz_ip="localhost";
if(typeof(test_ip)!="undefined")
      karotz_ip=test_ip;

var bad_http="curl error";

var buttonListener = function(event) 
{
    if (event == "DOUBLE") 
    {
        exit();
    }
    return true;
}

var endTTS = function(event) 
{
    if((event == "CANCELLED") || (event == "TERMINATED")) {
        exit();
    }
    return true;
}

var onKarotzConnect = function(data) 
{
    // Gestion du bouton pour pouvoir quitter l'application 
    karotz.button.addListener(buttonListener);

    // Dans tous les cas, on ferme l'application dans les 10sec
    setTimeout(10000, function() {exit();});
        
    karotz.led.light("6666FF");
    karotz.led.pulse("000066", 200, -1);
    
    var id = parseInt(params[instanceName].typeaction);
    var url = "";
    var urlapiserver = "";
    
    if (params[instanceName].api_user.indexOf("#")==0)
    {
       params[instanceName].api_user = params[instanceName].api_user.replace("#", "");
       urlapiserver = "http://apidev.eedomus.com";
    }
    else
    {
       urlapiserver = "http://api.eedomus.com";
    }


    karotz.led.light("66FF66");
    karotz.led.pulse("006600", 200, -1);

    switch (id)
    {
      // Uniquement voix depuis appel externe (partie tts gérée par la plateforme)
      case 1:
      break;
      
      // Lancement du scénario sur la box eeDomus
      case 2:
        karotz.tts.start("Daizolai, cette fonction n'est pas encore implémenté", "fr", endTTS);
      break;
      
      // Pilote un actionneur sur ON
      case 3:
        url = urlapiserver+"/set?action=periph.value&periph_id="+params[instanceName].periph_id+"&value=100&api_user="+params[instanceName].api_user+"&api_secret="+params[instanceName].api_secret;
        var data = http.get(url);
        if (data!=bad_http)
        {
            var obj = eval('(' + data + ')');
            
            if (obj.success=="0")
            {
            	txt = "Impossible de piloter le pairiphairique";
        		  karotz.tts.start(txt, "fr", endTTS);
            }
        }
        else
          exit();
      break;
      
      // Pilote un actionneur sur OFF
      case 4:
        url = urlapiserver+"/set?action=periph.value&periph_id="+params[instanceName].periph_id+"&value=0&api_user="+params[instanceName].api_user+"&api_secret="+params[instanceName].api_secret;
        var data = http.get(url);
        if (data!=bad_http)
        {
            var obj = eval('(' + data + ')');
            
            if (obj.success=="0")
            {
            	txt = "Impossible de piloter le pairiphairique";
        		  karotz.tts.start(txt, "fr", endTTS);
            }
        }
        else
          exit();
      break;
      
      // Lire la valeur d'un capteur
      case 5:
        url = urlapiserver+"/get?action=periph.caract&periph_id="+params[instanceName].periph_id+"&api_user="+params[instanceName].api_user+"&api_secret="+params[instanceName].api_secret;

        var data = http.get(url);
        if (data!=bad_http)
        {
            var obj = eval('(' + data + ')');
            
            if (obj.success=="1")
            {
          
          		txt = params[instanceName].txt_sensor;
          		txt = txt.replace("%val%", obj.body.last_value);
            }
            else
            	   txt = "Erreur lors de la lecture du pairiphairique";
            
        		karotz.tts.start(txt, "fr", endTTS);
        }
        else
          exit();
          
      break;
      
      // Forcer la valeur d'un périphérique
      case 6:
        url = urlapiserver+"/set?action=periph.value&periph_id="+params[instanceName].periph_id+"&value="+params[instanceName].val_periph+"&api_user="+params[instanceName].api_user+"&api_secret="+params[instanceName].api_secret;
        var data = http.get(url);
        if (data!=bad_http)
        {
            var obj = eval('(' + data + ')');
            
            if (obj.success=="0")
            {
            	txt = "Impossible de piloter le pairiphairique";
        		  karotz.tts.start(txt, "fr", endTTS);
            }
        }
        else
          exit();
      break;
    }
    
}

karotz.connectAndStart(karotz_ip, 9123, onKarotzConnect, {});
