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

    // Recharge dans les paramètres locaux l'adresse de la Zibase
    var ip_address = loadLocalParameter("ip_address");
    var tstIP = null;
    
    // Charge la page d'accueil Zibase pour tester l'adresse IP
    tstIP = http.get("http://" + ip_address + "/cgi-bin/domo.cgi");  

    if (!tstIP || tstIP==bad_http)
    {
      var plateform = params[instanceName].platform;
      var zibaseid = params[instanceName].zibaseid;
      var zibasetoken = params[instanceName].token;
      
    // Pour pouvoir ce connecter à la plateforme de développement, on utilise un # en début de l'id de la base
      if (zibaseid.indexOf("#")==0)
      {
        plateform = "zyebase.com";
        zibaseid = zibaseid.replace("#", "");
      }
      
      // L'adresse IP n'est pas correcte, on recharge l'IP depuis la plateforme
      var strip = http.get("http://" + plateform + "/m/set_iphone.php?action=api&action_api=get_ip&device=" + zibaseid + "&token=" + zibasetoken);
      
      if (!strip || strip==bad_http || strip=="KO")
      {
        ip_address = "";
      }
      else
      {
        var ip = strip.split(":");
  
        // L'adresse IP est ensuite sauvegardé en local
        ip_address = ip[0];
        saveLocalParameter("ip_address", ip_address);
      }
    }
    
    var id = parseInt(params[instanceName].typeaction);
    var url = "";

    if (ip_address=="")
    {
      karotz.led.light("FF0000");
    }
    else
    {
      karotz.led.light("66FF66");
      karotz.led.pulse("006600", 200, -1);
    }

    switch (id)
    {
      // Uniquement voix depuis appel externe (partie tts gérée par la plateforme)
      case 1:
      break;
      
      // Lancement du scénario sur la Zibase
      case 2:
        url = "http://" + ip_address + "/cgi-bin/domo.cgi?cmd=" + urlencode("lm ["+params[instanceName].scenario) + "]";
        http.get(url);
        exit();
      break;
      
      // Pilote un actionneur sur ON
      case 3:
        url = "http://" + ip_address + "/cgi-bin/domo.cgi?cmd="+ urlencode("on "+params[instanceName].code);
        http.get(url);
        exit();
      break;
      
      // Pilote un actionneur sur OFF
      case 4:
        url = "http://" + ip_address + "/cgi-bin/domo.cgi?cmd="+ urlencode("off "+params[instanceName].code);
        http.get(url);
        exit();
      break;
      
      // Lire la valeur d'un capteur
      case 5:
        url = "http://" + ip_address + "/sensors.xml";
        var data = http.get(url);
        if (data)
        {
            var sensor = params[instanceName].sensor.toUpperCase().replace("OS", "");
        		var objDom = new XMLDoc(data);
        		var domTree = objDom.docNode;
        		var node = domTree.selectNode("/evs/ev[@id=\""+sensor+"\"]");
        
            if (node)
            {
          		var v1 = node.getAttribute("v1")/10;
          		var v2 = node.getAttribute("v2");
          		
          		txt = params[instanceName].txt_sensor;
          		txt = txt.replace("%val1%", v1);
          		txt = txt.replace("%val2%", v2);
          	}
          	else
          	   txt = "Daizolai, je ne connais pas cette sonde";

        		karotz.tts.start(txt, "fr", endTTS);
        }
        else
          exit();
          
      break;
    }
    
}

karotz.connectAndStart(karotz_ip, 9123, onKarotzConnect, {});
