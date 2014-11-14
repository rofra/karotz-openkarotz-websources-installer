include("util.js");
var lang = "fr-FR";
var voice = "fr";

//var karotz_ip="192.168.0.185";
var karotz_ip="localhost";

var allQuestions = Array();
var nbJoker = 1;
var level = 1;
var idQuestion = 0;
var nbQuestions = 0;
//var lvlmax = 5;
var lvlmax = parseInt(params[instanceName].lvlmax);
//var easy = true;
var easy = (parseInt(params[instanceName].difficulte) == 1);

var buttonListener = function(event) {
    if (event == "DOUBLE") {
        karotz.tts.stop();
        exit();
    }
    return true;
};

var main = function(event) {
	if(waitTerminated(event)){
		idQuestion = Math.floor(Math.random() * nbQuestions);
		karotz.tts.start("Voici la question "+ level, voice, function(event){
			if(waitTerminated(event)){
				karotz.ears.moveRelative(-9,9,function(event){return;});
			    karotz.led.light("000000");
			    karotz.led.pulse("0000FF", 200, -1, function(event){return;});
				karotz.multimedia.play("http://www.fan2tv.com/generiquestv/maillonfaible_jouonsaumaillonfaible.mp3", question);
			}
		});
	}
};

var question = function(event){
	if(waitTerminated(event)){
	    karotz.led.light("000000");
	    karotz.led.pulse("0000FF", 100, -1, function(event){return;});
		karotz.tts.start(allQuestions[idQuestion].question, voice, function(event) {
			if(waitTerminated(event)){
				//var reponse = allQuestions[idQuestion].reponse +"";
				// reponse = reponse.replace(/ /g, " | ");
				// reponse = reponse.replace(/,/g, " virgule ");
				// reponse = reponse.replace(/î/g, "i");
				// reponse = reponse +" | joker | repete la question | " + allQuestions[idQuestion].reponse;
				// reponse = reponse.replace(/[.'-]/g, " ");
				
				var reponse = "joker | repete la question | " + allQuestions[idQuestion].reponse;
				var reponses = allQuestions[idQuestion].reponse +"";
				var reponsesArray = reponses.split(' ');
				for(var i=0;i<reponsesArray.length;i++){
					var curReponse = reponsesArray[i].toLowerCase().replace(/^\s+/g,'').replace(/\s+$/g,'');
					if(curReponse != "un" && curReponse != "une"
						&& curReponse != "le" && curReponse != "la" && curReponse != "les" && 
						curReponse != "de" && curReponse != "du" && curReponse != "des"){
						
						reponse = reponse +" | "+ curReponse;
					}
				}
				reponse = reponse.replace(/,/g, " virgule ");
				reponse = reponse.replace(/î/g, "i");
				
				log("(idQuestion: "+ allQuestions[idQuestion].id +") Réponse: "+ allQuestions[idQuestion].reponse +"\t Grammaire réponse: "+ reponse);
				karotz.asr.string(reponse, lang, function(asrResult){
		   		 	log("Attendu: "+ allQuestions[idQuestion].reponse +"\tEntendu: "+ asrResult.text +"\tIndice de confiance : "+ asrResult.confident +"%");
					if(asrResult.text == "joker"){
						if(nbJoker > 0){
							karotz.led.light("5ECABD");
							karotz.ears.moveRelative(8,-8,function(event){return;});
							karotz.multimedia.play("http://www.fan2tv.com/generiquestv/quiveutgagnerdesmillions_joker_5050.mp3", function(event) {
								if(waitTerminated(event)){
									nbJoker--;
									var txt = "Joker pris en compte. La bonne réponse était : "+ allQuestions[idQuestion].reponse +". Je vais donc te poser une nouvelle question. ";
									if(nbJoker>0){
										txt += "Il te reste encore "+ nbJoker +" jokers";
									}else{
										txt += "Il ne te reste plus aucun joker";
									}
									karotz.tts.start(txt, voice, main);
								}											
							});
						}else{
							karotz.led.light("FF0000");
							karotz.tts.start("Désolé, tu n'avais plus de joker disponible. La bonne réponse était : "+ allQuestions[idQuestion].reponse +".", voice, perdu);
						}
					}else if(asrResult.text == "repete la question"){
						question("TERMINATED");
					}else if(asrResult.text != "<nomatch>"){
						level++;
						karotz.led.light("00FF00");
						if(level>lvlmax){
							karotz.ears.moveRelative(-15,15,function(event){return;});
							karotz.multimedia.play("http://www.fan2tv.com/generiquestv/quiveutgagnerdesmillions_gagne_million.mp3", function(event) {
								if(waitTerminated(event)){
									karotz.tts.start("Féliciation ! Tu as réussi à répondre aux "+ lvlmax +" questions. Tu as gagné ! Bravo.", voice, function(event){
										if(waitTerminated(event)){
											exit();
										}
									});
								}
							});
						}else{
							karotz.ears.moveRelative(-5,5,function(event){return;});
							karotz.multimedia.play("http://www.fan2tv.com/generiquestv/quiveutgagnerdesmillions_gagne_tiers1.mp3", function(event) {
								if(waitTerminated(event)){
									var txt = "Bonne réponse";
									if((level%5) == 0){
										nbJoker++;
									    karotz.led.pulse("5ECABD", 100, -1, function(event){return;});
										txt += "tu m'a donné "+ (level-1) +" bonne réponse consécutive. Tu as gagné un joker supplémentaire. ";
										if(nbJoker>0){
											txt += "Tu as donc maintenant "+ nbJoker + " jokers à ta disposition. Félicitations";
										}
									}
									karotz.tts.start(txt, voice, main);
								}
							});
						}
					}else{
						karotz.led.light("FF0000");
						karotz.multimedia.play("http://www.fan2tv.com/generiquestv/toutlemondeveutprendresaplace_mauvaisereponse.mp3", function(event) {
							if(waitTerminated(event)){
								karotz.tts.start("Dommage ! La réponse était "+ allQuestions[idQuestion].reponse +".", voice, perdu);
							}
						});
					}
				});
				
			}
		});
	}
};

var perdu = function(event) {
	if(waitTerminated(event)){
		karotz.tts.start("Tu as tenté ta chance, et tu as perdu. <prosody rate = 'x-fast'>Au revoir !</prosody>", voice, function(event){
			if(waitTerminated(event)){
			    karotz.led.light("000000");
			    karotz.led.pulse("FF0000", 200, -1, function(event){return;});
				karotz.ears.moveRelative(-40,40,function(event){return;});
				karotz.multimedia.play("http://www.fan2tv.com/generiquestv/maillonfaible_marchedelahonte.mp3", function(event) {
					if(waitTerminated(event)){
						exit();
					}
				});
			}
		});
	}
};

var onKarotzConnect = function(data) {
    karotz.button.addListener(buttonListener);
    
	karotz.ears.reset(function(event){return;});
    karotz.led.light("000000");
    karotz.led.pulse("FFFFFF", 400, -1, function(event){return;});
  
	log("Lecture fichier json");
	if(easy){
		var data = file.read("questions_easy.js");
	}else{
		var data = file.read("questions_hard.js");
	}
	
	log("Evaluation des données");
	eval("allQuestions = "+ data.text);
	nbQuestions = allQuestions.length;
	log("Nombre de questions : "+ nbQuestions);
	
	karotz.multimedia.play("http://www.fan2tv.com/generiquestv/questionspourunchampion_generique.mp3", function(event) {
//	karotz.multimedia.play("http://www.fan2tv.com/generiquestv/quiveutgagnerdesmillions.mp3", function(event) {
		if(event == "ok"){
			karotz.ears.moveRelative(8,-8,function(event){return;});
		}
		if(waitTerminated(event)){
			karotz.tts.start("Attention ! Je vais poser "+ lvlmax +" questions. Tu dois y répondre correctement. A tout moment, tu pourra utiliser ton joker, en répondant joker. <break time='200ms'/>Prêt ? <break time='600ms'/> C'est partit", voice, main);
		}
	});
};
karotz.connectAndStart(karotz_ip, 9123, onKarotzConnect, {});

function test(i){
		karotz.tts.start(allQuestions[i].question, voice, function(event) {
			if(waitTerminated(event)){
				test(i+1);
			}
		})
	return;
}
