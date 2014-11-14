include("util.js");
var debug = false;
var lang = "fr";
var voice = "fr";

//var karotz_ip="192.168.0.200";
var karotz_ip="localhost";

var buttonListener = function(event) {
	if (event == "DOUBLE") {
		karotz.tts.stop();
		exit();
	}
    if (event == "SIMPLE") {
		karotz.led.light("000000");
		karotz.tts.start("Je vais afficher plusieurs couleurs de suite. En fait, une à chaque fois que je bougerais mes oreilles. Quand je te le demanderais, tu dois me les nommer dans l'ordre, de la première à la dernière. Si la couleur que tu site est la bonne, mon ventre clignotera et tu pourra énoncer la suivante. Sinon, tu as perdu.", voice, main);
	}
	return true;
};

var couleurs = new Array();
couleurs[0] = new Array();
couleurs[0]["led"]="FF0000";
couleurs[0]["name_fr"]="rouge";
couleurs[0]["name_en"]="red";
couleurs[1] = new Array();
couleurs[1]["led"]="00FF00";
couleurs[1]["name_fr"]="vert";
couleurs[1]["name_en"]="green";
couleurs[2] = new Array();
couleurs[2]["led"]="0000FF";
couleurs[2]["name_fr"]="bleu";
couleurs[2]["name_en"]="blue";
couleurs[3] = new Array();
couleurs[3]["led"]="FFFF00";
couleurs[3]["name_fr"]="jaune";
couleurs[3]["name_en"]="yellow";

var playlist = new Array({});
var currentLevel = 0;
var level = 1;
//var maxLevel = parseInt(params[instanceName].maxLevel);
var maxLevel = 7;
var joker = true;

var waitTerminated = function(event){
	if(debug)
		debuglog("Event "+ event);
	if (event == "TERMINATED" || event == "CANCELLED"){
		return true;
    }else if (event == "ERROR"){
    	debuglog("Erreur : fermeture de l'application");
    	exit();
    }
	return false;
};


var gameOver = function(expected){
	karotz.led.light(expected["led"]);
	karotz.tts.start("Perdu ! La couleur était "+ expected["name_"+ lang], voice, function(event){
		if (event != "OK"){
			exit();
		}
	});
};


var main = function(event) {
	if(waitTerminated(event)){
	   	if(currentLevel<level){
		   	karotz.led.light(couleurs[playlist[currentLevel]]["led"]);
			currentLevel++;
			var earsLeft = (5*(currentLevel%2));
			var earsRight = (5*((currentLevel+1)%2));
			karotz.ears.moveRelative(earsLeft,earsRight,function(event){});
			setTimeout(2000,function(){main('TERMINATED');});
		}else{
			currentLevel = 0;
			karotz.led.light("000000");
			if(level==1){
				karotz.tts.start("Peut tu me citer la couleur que j'ai choisi ?", voice, verifyLevel);
			}else{
				karotz.tts.start("Peut tu me citer les "+ level +" couleurs ?", voice, verifyLevel);
			}
		}
	}
};

var verifyLevel = function(event){
	if(waitTerminated(event)){	
		if(currentLevel<level){
			var currentColor = couleurs[playlist[currentLevel]]["name_"+ lang];
			debuglog("Karotz écoute la réponse "+ (currentLevel+1) +" ("+ currentColor +")");
			karotz.asr.string(currentColor, "fr-FR", function(asrResult){
				debuglog("Attendu: "+ couleurs[playlist[currentLevel]]["name_"+ lang] +"\tEntendu: "+ asrResult.text +"\tIndice de confiance : "+ asrResult.confident +"%");
				karotz.led.light("000000");
				if(asrResult.text != couleurs[playlist[currentLevel]]["name_"+ lang]){
					if(level>5 && joker){
						joker = false;
						karotz.led.light(couleurs[playlist[currentLevel]]["led"]);
						var colorList = "";
						for(var i=0;i<=currentLevel;i++){
							colorList = colorList +" le "+ couleurs[playlist[i]]["name_"+ lang] +",";
						}
						if(currentLevel+1 < level){
							colorList = colorList + " et le ...";
						}
						karotz.tts.start("Dommage ! La couleur était "+ couleurs[playlist[currentLevel]]["name_"+ lang] +". Mais comme je t'aime bien je te laisse une seconde chance. Nous avons donc " + colorList, voice, verifyLevel);
						currentLevel++;
						return;
					}else{
						gameOver(couleurs[playlist[currentLevel]]);
						return;
					}
				}
		   		karotz.led.pulse(couleurs[playlist[currentLevel]]["led"], 100, 300, verifyLevel);
		   		currentLevel++;
			});
		}else{
			currentLevel = 0;
			level++;
			if(level % 6== 0){
				joker = true;
			}
		    karotz.ears.reset(function(event){return;});
			var rand = Math.floor(Math.random() * 5);
			if(level>maxLevel){
				karotz.tts.start("Bravo, tu as gagné", voice, function(event){
					if(waitTerminated(event)){	
						exit();
					}
				});
			}else if(level<=2){
				karotz.tts.start("Trop facile ! Je vais devoir ajouter des couleurs...", voice, main);
			}else if(rand==1 || level == 3){
				karotz.tts.start("Felicitation ! Essayons maintenant avec "+ level +" couleurs", voice, main);
			}else if(rand==2){
				karotz.tts.start("Hum... Peut être que les "+ level +" couleurs te poserons plus de difficultés", voice, main);
			}else if(rand==3){
				karotz.tts.start("Que tu es intelligent... Comme tu as une bonne mémoire ! Et je suis certain que les "+ level +" couleurs ne te font pas peur", voice, main);
			}else if(rand==4){
				karotz.tts.start("Bravo ! Voyons comment tu te débrouille avec "+level +" couleurs", voice, main);
			}else{
				karotz.tts.start("Moi aussi je sais le faire ! Et j'y arrive même avec "+ level +" couleurs", voice, main);
			}
		}
	}
};

var onKarotzConnect = function(data) {
	if(debug){
	/*	if (karotz_ip == 'localhost') {
			karotz.serial.open("/dev/ttyGS0", 9600);
		}*/
		debuglog("**************** demarrage de l'application ***********");
	}
	karotz.button.addListener(buttonListener);
	for(var i=0;i<maxLevel;i++){
		playlist[i] = Math.floor(Math.random() * 4);
	}
	karotz.led.light("000000");
	karotz.ears.reset(function(event){return;});
	karotz.tts.start("Mémorise les couleurs. Je commence avec le... je sais pas... heu... le "+ couleurs[playlist[0]]["name_"+ lang] +". Attention... C'est partit !", voice, main); 
};

karotz.connectAndStart(karotz_ip, 9123, onKarotzConnect, {});
