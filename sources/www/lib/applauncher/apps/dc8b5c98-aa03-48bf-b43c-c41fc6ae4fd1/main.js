include("util.js");
include("fonctions.js");

var ordi;
var monretour;
var asrTable = "Pierre|Papier|Ciseaux|Au revoir";
var AsrTable = ["Pierre","Papier","Ciseaux"];
var score_ordi=0;
var score_moi=0;
var stop=0;
var gagne=0;
var gagne_suivre=0;
var strategie=1;
var debut=1;

var retour = function (asrResult)
{
	monretour = asrResult.text;
	//log("########## JOUEUR : "+monretour+" ###########");
	if (monretour=="<nomatch>")
	{
		karotz.led.fade("4F0000",500);	//Rouge
		karotz.ears.reset();
		stop++;
		if(stop==1)
			speakAndGoto("Je suis désolé, je n'ai pas compris, essaye à nouveau",2,0);
		if(stop==2)
			speakAndGoto("Excuse moi, peux-tu répéter ?",2,0);
		if(stop==3)
			speakAndGoto("Tu peux parler plus fort s'il te plait",2,0);
		if(stop==4)
			speakAndGoto("Je te rappelle qu'il faut dire pierre, papier ou ciseaux ?",2,0);
		if(stop==5)
			speakAndGoto("Bon, si tu n'est pas là, au revoir !",40,0);
	}
	else if(monretour=="Au revoir")
	{
		karotz.led.fade("0000FF",500);	//Bleu
			speakAndGoto("Je suis certain que tu as peur de perdre ! Au revoir",40,0);
	}
	else
	{
		stop=0;
		debut=0;
		karotz.ears.move(1,1);
		karotz.led.fade("00FF00", 500);  //Vert
		speakAndGoto(ordi,20,1);
	}
}

function automate(num)
{
	switch (num)
	{
		case 1:		//Choix stratégie
			//log("########## CASE 1 ##########");
			//log("########## PARTIE GAGNE A SUIVRE : "+gagne_suivre+" ##########");
			if(debut==1){
				speakAndGoto("Chifoumi", 14, 0);
			}
			else if(gagne_suivre==5){
				if(strategie<=4){
					gagne_suivre=0;
					strategie++;
					if(strategie==2)
						speakAndGoto("Tu te débrouilles bien, je change de stratégie. Chifoumi", 10+strategie, 0);
					if(strategie==3)
						speakAndGoto("Quel talent, voyons voir ce que tu as dans le ventre. Chifoumi", 10+strategie, 0);
					if(strategie==4)
						speakAndGoto("Je ne sais pas comment tu fais fais cette fois tu ne pourras plus rien faire contre mes stratégies. Chifoumi", 10+strategie, 0);
				}
			}
			else
				speakAndGoto("Chifoumi", 10+strategie, 0);
		break;

		case 2:		//Choix utilisateur
			//log("########## KAROTZ : "+ordi+" ###########");
			//log("########## CASE 2 ##########");
			karotz.asr.string(asrTable, "fr", retour);
		break;

		case 11:	//Stratégie 1
			//log("########## CASE 11 ##########");
			if(gagne==0){
				if(ordi=="Pierre")
					ordi="Papier";
				else if(ordi=="Papier")
					ordi="Ciseaux";
				else if(ordi=="Ciseaux")
					ordi="Pierre";}
			automate(2);
		break;

		case 12:	//Stratégie 2
			//log("########## CASE 12 ##########");
			if(gagne==0){
				if(monretour=="Pierre")
					ordi="Papier";
				else if(monretour=="Papier")
					ordi="Ciseaux";
				else if(monretour=="Ciseaux")
					ordi="Pierre";}
			if(gagne==1){
				if((monretour=="Pierre")&&(ordi=="Papier"))
					ordi="Ciseaux"
				else if((monretour=="Pierre")&&(ordi=="Ciseaux"))
					ordi="Papier";
				else if((monretour=="Papier")&&(ordi=="Pierre"))
					ordi="Ciseaux"
				else if((monretour=="Papier")&&(ordi=="Ciseaux"))
					ordi="Pierre"
				else if((monretour=="Ciseaux")&&(ordi=="Pierre"))
					ordi="Papier"
				else if((monretour=="Ciseaux")&&(ordi=="Papier"))
					ordi="Pierre"}
			if(gagne==2){
				if(monretour=="Pierre")
					ordi="Ciseaux";
				else if(monretour=="Papier")
					ordi="Pierre";
				else if(monretour=="Ciseaux")
					ordi="Papier";}
			automate(2);
		break;

		case 13:	//Stratégie 3
			//log("########## CASE 13 ##########");
			if(gagne==0){
				if(monretour=="Pierre")
					ordi="Pierre";
				if(monretour=="Papier")
					ordi="Papier";
				if(monretour=="Ciseaux")
					ordi="Ciseaux";
			}
			if(gagne==1){
				if(ordi=="Pierre")
					ordi="Ciseaux";
				if(ordi=="Papier")
					ordi="Pierre";
				if(ordi=="Ciseaux")
					ordi="Papier";
			}
			if(gagne==2){
				var rand = Math.round(Math.random()*2);
				ordi = AsrTable[rand];
			}
			automate(2);
			
		break;

		case 14:	//Stratégie 4
			//log("########## CASE 14 ###########");
			var rand = Math.round(Math.random()*2);
			ordi = AsrTable[rand];
			automate(2);
		break;

		case 20:	//Cherche qui a gagné
			//log("########## CASE 20 ###########");
			if(ordi==monretour){
				gagne=2;
				speakAndGoto("Match nul !",30,1);}
			if((ordi=="Pierre")&&(monretour=="Papier")){
				gagne=0;
				gagne_suivre++;
				score_moi++;
				speakAndGoto("Tu as gagné !",30,1);}
			if((ordi=="Pierre")&&(monretour=="Ciseaux")){
				gagne=1;
				gagne_suivre=0;
				score_ordi++;
				speakAndGoto("Tu as perdu !",30,1);}
			if((ordi=="Papier")&&(monretour=="Pierre")){
				gagne=1;
				gagne_suivre=0;
				score_ordi++;
				speakAndGoto("Tu as perdu !",30,1);}
			if((ordi=="Papier")&&(monretour=="Ciseaux")){
				gagne=0;
				gagne_suivre++;
				score_moi++;
				speakAndGoto("Tu as gagné !",30,1);}
			if((ordi=="Ciseaux")&&(monretour=="Pierre")){
				gagne=0;
				gagne_suivre++;
				score_moi++;
				speakAndGoto("Tu as gagné !",30,1);}
			if((ordi=="Ciseaux")&&(monretour=="Papier")){
				gagne=1;
				gagne_suivre=0;
				score_ordi++;
				speakAndGoto("Tu as perdu !",30,1);}
		break;

		case 30:	//On dit les scrores
			//log("########## CASE 30 ##########");
			if(score_ordi>score_moi)
				var say=score_ordi+" - "+score_moi+" pour moi";
			else if(score_ordi<score_moi)
				var say=score_moi+" - "+score_ordi+" pour toi";
			else
				var say=score_moi+" partout";

			speakAndGoto(say,1,1);		
		break;

		case 40:	//On quitte le programme
			//log("########## CASE 40 ##########");
			exit();
		break;
	}
}

var buttonListener = function(event) {
	if ((event == "DOUBLE")||(event == "SIMPLE")) {
		exit();
	}
}

var onKarotzConnect = function(data)
{
	karotz.button.addListener(buttonListener);
	automate(1);
}

karotz.connectAndStart("localhost", 9123, onKarotzConnect, {});
