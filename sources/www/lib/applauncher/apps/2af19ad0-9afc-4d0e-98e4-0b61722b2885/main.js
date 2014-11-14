/*

1.0.2:
- Suppression du décodage UTF8 (il est maintenant géré par le server distant)

1.0.1:
- Ajout d'un décodage UTF8
- Modification de hauteur de la voix

1.0.0:
- Première version

*/


var version = "102" //1.0.2

var karotz_ip="localhost" //ip du karotz "localhost" par défaut, pour la VM utilisé l'ip du lapin
//var karotz_ip = "192.168.0.18"


function fortune()
{
	var data = http.get("http://joel.matteotti.free.fr/fortune/?version="+version);
	
	log(data)



	// , => 350ms
	// . => 400ms
	// : => 150ms
	
	
	/*
	
    silent => Karotz's voice will not change (does nothing)
    x-soft => Karotz's voice will be 25% softer
    soft => Karotz's voice will be 50% softer
    medium => Karotz's voice will remain at the default volume
    loud => Karotz's voice will be 50% stronger
    x-loud => Karotz's voice will be 100% stronger
	*/
	
	//<voice emotion='happy'><prosody volume = 'loud' pitch = 'high'> xxxxx </prosody></voice>
	
	
	data=data.replace(",","<break time='350ms'/>");
	data=data.replace(".","<break time='400ms'/>");
	data=data.replace(":","<break time='150ms'/>");
	data=data.replace("-+-","");
	data=data.replace("+","");
	data=data.replace(/^\s+/g,'').replace(/\s+$/g,''); //trim
	
	
	
	//si la ligne contient -+- on vire -+- et on commence par Auteur: 


    karotz.button.addListener(buttonListener);
    //karotz.tts.start(data, "fr", exitFunction);
	
	var tts = "<voice emotion='calm'><prosody volume = 'medium' pitch = 'high'>"+data+"</prosody></voice>"
	log(tts)
	
	karotz.tts.start(tts,"fr",exitFunction);
}



//fonction permettant de se connecté au karotz
karotz.connectAndStart = function(host, port, callback, data)
{	
    try
	{
        karotz.connect(host, port);
    	log("connected");
    	karotz.start(callback, data);
    }
	catch(err)
	{
    	log(err);
    }
};


//fonction de gestion du bouton
var buttonListener = function(event) 
{
	log("bouton");
	if (event == "LONG_START")
	{
		log("long appuie");
		
			karotz.asr.string("fortune", "fr-FR", function(asrResult) 
			{
				log("j'écoute");
				var I_have_heard = asrResult.text;
				log("j'ai compris: "+I_have_heard);
				
				if ((I_have_heard == "<nomatch>") || (I_have_heard == "No result before the no-input timeout") || (I_have_heard == "<error_server_timeout>")) 
					karotz.tts.start("j'ai rien compris","fr",exitFunction);
				else
					fortune();
			});
	}
	
    return true;
}


//fonction appellé lorsqu'on quitte l'application
var exitFunction = function(event) 
{
    if((event == "CANCELLED") || (event == "TERMINATED")) 
	{
        exit();
    }
    
	return true;
}



var onKarotzConnect = function(data) 
{
	karotz.button.addListener(buttonListener);
	fortune();
}

karotz.connectAndStart(karotz_ip, 9123, onKarotzConnect, {});
