include("util.js");
var karotz_ip = "localhost"//<= ATTENTION : ici votre adresse IP !
//var karotz_ip = "192.168.1.29 "//<= ATTENTION : ici votre adresse IP !
var num_son = 0;
var num_q = 0;
var question = true;
var question_pose = false;
var quitter = false;
var lecture_en_cours = 0;
 if (karotz_ip == 'localhost') { var lang = params[instanceName].lang; }
  else var lang = "p";
var pas;   

var mlog = function(string) {
    var d = new Date();
    var hh = "" + d.getHours();
    var mm = d.getMinutes();
    if (mm < 10) { mm = "0" + mm; }
    hh = hh + 'h' + mm + " : ";
 if (karotz_ip == 'localhost') {
  karotz.serial.write(hh + string + '\n\r');}
  else log(hh + string + '\n\r');
   
 
    return true
}


// SET a random led color
var randColor = function() {
    var color = "" + Math.floor(Math.random() * 16777215).toString(16);
    mlog("light: " + color);
    karotz.led.light(color);
    return true;
}

var event3 = function(event) {
    if (event != "TERMINATED")  {
        event3;
    }
    return true;

}
var event2 = function(event) {
    mlog(" event 2 : " + event);
    karotz.led.light("FF0000");
    mlog("LED = rouge ");
    if (event == "TERMINATED") {
        lecture_en_cours = 0;
        //karotz.multimedia.stop();
        question_pose = !question_pose;
        karotz.led.light("0000FF");
        mlog("LED = bleu ");
        return true;
    }
    return true;

}
var event1 = function(event) {
mlog(" event 1 : " + event);
karotz.led.light("FF0000");
mlog("LED = rouge ");
    if (event == "TERMINATED")  {
        lecture_en_cours = 0;
        //karotz.multimedia.stop();
        question_pose = !question_pose;
        mlog("LED = vert ");
        karotz.led.light("00FF00");
        return true;
    }
    return true;

}
var onKarotzConnect = function(data) {
 if (karotz_ip == 'localhost') {
    karotz.serial.open("/dev/ttyGS0",9600);
        for (var j = 0; j < 1000; j++) {
        for (var k = 0; k < 1000; k++) {
        };
    };
}
mlog(" **************** demarrage de l'application *********");
//je prépare mon choix aleatoire par un top depart et le pas
num_son = 1 + Math.floor(Math.random() * 26)
pas = ((1 + Math.floor(Math.random() * 5))*2)+1;
mlog("mon pas aleatoire est de : " + pas + " et mon top depart est : " + num_son);
karotz.led.light("00FF00"); 
karotz.multimedia.play("http://www.bregeon.net/karotz/cris/" + lang + "0" + ".ogg",event3);
karotz.rfid.addListener(function(data) {
    karotz.led.light("FF0000");
    karotz.led.pulse("0000FF", 1000,1000, function(event) { return true });
	question_pose = false;
    question = !question;
    if (question) mlog(' je passe en mode question');
    if (!question) mlog(' je quitte le mode question');
    return true;
});
    karotz.button.addListener(function(event) {
        //randColor();
       mlog("appui bouton event je teste EVENT si DOUBLE je sors, si SIMPE je regarde la suite; voici mon EVENT : " + event + " et voici la valeur de 'quitter' : " + quitter );
       //mlog("Si simple il faut que lecture en cours soit egal à 0, voici la valeur de lecture en cours : " + lecture_en_cours);
       //mlog("si SIMPLE ET lecture à 0 suis-je en mode question voici le mode question (1 = oui " + lecture_en_cours + " question " + question + " question posee " + question_pose);
        if ((event == "LONG_START") && (lecture_en_cours == 0)) {
   		mlog ("appui long est-ce un arret souhaite? : " );
		if (!quitter){
		quitter = true;
           karotz.tts.start("si tu veux vraiment quitter refait un appui : long sur le bouton",'FR',event3);}
		   else
		   {
		   karotz.tts.stop();
			mlog ("appui long deux fois, je quitte ");
             exit();
			}
		}
		else if ((event == "SIMPLE") || (event == "DOUBLE"))//ça n'est pas un appui long
			{
			//if ((event == "SIMPLE") && (lecture_en_cours == 0) && (question) && (!question_pose)) {
			if ( (lecture_en_cours == 0) && (question) && (!question_pose)) {
			quitter = false;
			mlog ("appui  pas de lecture en cours, mode question et pas de question posee je pose donc une question ");
			var num_son_old = num_son;
			//while (num_son_old == num_son){    num_son = 1 + Math.floor(Math.random() * 26);}
				num_son += pas; if (num_son >= 27) { num_son = num_son-26; }
				mlog("mon ancien son : " + num_son_old + " mon pas : " + pas + " mon nouveau son : " + num_son);
				num_q = 100 + num_son;
				//question_pose = true;
				lecture_en_cours = 1;
				mlog ("multimediaplay1 (numq): " + lang + num_q + ".ogg");
				karotz.multimedia.play("http://www.bregeon.net/karotz/cris/" + lang + num_q + ".ogg", event2);

			}
			//if ((event == "SIMPLE") && (lecture_en_cours == 0) && question && (num_q > 0)) {
		   if ((lecture_en_cours == 0) && question && (num_q > 0)) {
		   quitter = false;
			mlog ("appui  pas de lecture en cours, mode question et num_q (numero question) > 0 donc question posee je lis la reponse ");
			  num_q = 0;
				//question_posee = true;
				mlog("num_q : " + num_q);
				mlog ("lecture de la reponse (numson): " + lang + num_son + ".ogg"); 
				karotz.multimedia.play("http://www.bregeon.net/karotz/cris/" + lang + num_son + ".ogg", event1);

			}
			//if ((event == "SIMPLE") && (lecture_en_cours == 0) && !question) {
			if ( (lecture_en_cours == 0) && !question) {
			quitter = false;
			mlog ("appui simple pas de lecture en cours, mode SANS question je lis en sequentiel ");
				num_son += 1; if (num_son >= 27) { num_son = 1; }
				num_q = 100 + num_son;
				//randColor();
				lecture_en_cours = 1;
				mlog ("lecture sans question (numson): " + lang + num_son + ".ogg");
				karotz.multimedia.play("http://www.bregeon.net/karotz/cris/" + lang + num_son + ".ogg", event1);
			}
			//mlog ("je quitte l'evenement bouton pendant que le lapin parle ou parce que event different de simple ou double ");
		}
         return true;
    });
 if (karotz_ip == 'localhost') {
    mlog(' appli lancee par ' + launchType.name);
    mlog(' identifiant du lapin : ' + params[instanceName].uuid);
    if (lang == "p") mlog(' pays : espagne' );
    if (lang == "b") mlog(' pays : france');
    if (lang == "c") mlog(' pays : canada');
    if (lang == "k") mlog(' pays : angleterre');
    if (lang == "d") mlog(' pays : allemagne');
    if (lang == "s") mlog(' pays : Etats Unis');
}   
}
karotz.connectAndStart(karotz_ip, 9123, onKarotzConnect, {});