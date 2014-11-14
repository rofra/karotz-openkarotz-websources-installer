//                      / \         / \  /                \
//                       \  \       /  / |  www.karotz.com  |
//                        \  \     /  /   \____  __________/
//                _  __    \  \___/  /    _    /_/        
//               | |/ /    /         \   | |       
//               | ' /  __|_  O __O __|  | |_  ____
//               |  <  / _` || '__|/ _ \ | __||_  /
//               | . \| (_| || |  | (_) || |_  / / 
//               |_|\_\\__,_||_|   \___/  \__|/___|
//      
//  ********************************************************************************************************************************************************************
//  *  Application : app_Karotzaire                                                                                                               Version : 0.1.0      *
//  *                                                                                                                                                                  *
//  *  Objectif :   Cette application vous annonce les prochains rendez vous de la semaines (sModeAnnonce =N prochains Jours) ou pour chaque type de rappel le prochain*
//  *  jour  (sModeAnnonce =par type de rappel)                                                                                                                        *
//  *                                                                                                                                                                  *
//  *  Historique :                                                                                                                                                    *
//  *  0.0.1  utilise BilbliotequeGestionDates v0.0.2                                                                                                                  *
//  *  0.0.2 à 0.1.2 correction sur initfromxml                                                                                                                        *
//  *  0.1.3 main inchangé nouvelle bliblothèque v 0.0.4 avec gestion avec gestion des 1ers mardis du mois                                                              *
//  ********************************************************************************************************************************************************************

include("util.js");

var karotz_ip = 'localhost';
var debugvm = false;

// gestion de 4 Rappels avec date à calculer, type de RDV  Jours de RDV, matin ou soir et liste de dates
var tDateRappel= new Array ("", "", "", "");
var tTypeRappel= new Array ("aucune", "aucune", "aucune", "aucune");
var tJoursRappel= new Array ("", "", "", "");
var tMatinOuSoirRappel = new Array ("", "", "", "");
var tListeDatesRappel = new Array ("", "", "", "");


var sDateDuJour ="", sMessage="", sModeAnnonce="";

include("BibliothequeGestionDates.js");

// fonction qui gère le double appui du bouton
var buttonListener = function(event) {
   if (event == "DOUBLE") {
     exit();
     }
   return true;
}

// fonction qui quitte le programme si évenement est cancelled ou terminated
var exitFunction = function(event) {
  if ((event == "CANCELLED") || (event == "TERMINATED")) {
    debuglog ("exit");
    exit();
  }
  debuglog ("event =" + event);
  return true;
}


//Initialisation des 4 tableaux à partir des variables renseignés dans le screen.xml (mode embarqué)
var initFromScreenXml = function() {
 var i=0; 
 debuglog ("debut initFromScreenXml");
 // initialisation rappel 1 i= 0 avec jours de rappel et sans date de rappel
 tTypeRappel[i] = params[instanceName].sNomRappel1.slice(0);
 tJoursRappel[i] = params[instanceName].sJoursRappel1.slice(0);
 tListeDatesRappel[i]="";
 tMatinOuSoirRappel[i] = params[instanceName].sMatinOuSoirRappel1.slice(0);
 
 // initialisation rappel 2 (i= 1) avec jours de rappel et sans date de rappel
 i=1;
 tTypeRappel[i] = params[instanceName].sNomRappel2.slice(0);
 tJoursRappel[i] = params[instanceName].sJoursRappel2.slice(0);
 tListeDatesRappel[i]="";
 tMatinOuSoirRappel[i] = params[instanceName].sMatinOuSoirRappel2.slice(0);
 
 // initialisation rappel 3 (i=2)sans jour de rappel avec dates de rappel
 i=2;
 tTypeRappel[i] = params[instanceName].sNomRappel3.slice(0);
 tJoursRappel[i] = "liste dates";
 tListeDatesRappel[i]=params[instanceName].sDatesRappel3.slice(0);
 tMatinOuSoirRappel[i] = params[instanceName].sMatinOuSoirRappel3.slice(0);
 
  // initialisation rappel 4 sans jour de rappel avec dates de rappel
  i=3;
  tTypeRappel[i] = params[instanceName].sNomRappel4.slice(0);
  tJoursRappel[i] = "liste dates";
  tListeDatesRappel[i] = params[instanceName].sDatesRappel4.slice(0);
  tMatinOuSoirRappel[i] = params[instanceName].sMatinOuSoirRappel4.slice(0);
  
  for (i=0; i<4; i++) {
    // si type de rappel est vide ou seulement avec des blancs alors on indique 'aucune' 
    var reg=new RegExp("( )", "g");
    var sTypeRappel= tTypeRappel[i].replace(reg,"");
    if (sTypeRappel.length==0) {tTypeRappel[i]='aucune';}
    debuglog("tListeDatesRappel["+i+"] :"+tListeDatesRappel[i]);
    debuglog("tJoursRappel["+i+"] :"+tJoursRappel[i]+ " pour le type de rappel : "+ tTypeRappel[i]);
  }
 
 // initialisation du message avec les noms des personnes en charge des poubelles
  if (params[instanceName].nomPersonnes.slice(0) != "") { 
    sMessage = "Bonjour " + params[instanceName].nomPersonnes.slice(0)+ " !" + " Nous sommes le " + sDateDuJour+". ";
  }
  sModeAnnonce=params[instanceName].sModeAnnonce.slice(0);
  debuglog("sModeAnnonce :"+sModeAnnonce+"|");
 
}

var onKarotzConnect = function(data) {
 
  //gestion du port série en mode embarqué pour l'affichage des logs
  // (karotz_ip == 'localhost') { karotz.serial.open("/dev/ttyGS0", 9600);}
  debuglog ("debut application V0.1.2");
  
  sDateDuJour = constructionDatestravecDate (dDateDuJour, true, "");
  
  // initialisation des variables en mode VM (simulation) et en mode embarqué
  //en mode VM avoir un fichier screen.js dans la répertoire de l'application
  if (typeof(instanceName)=='undefined') {include ("./screen.js");} else {initFromScreenXml();}

  //Annonce par jour : aujourd'hui, demain, dans deux jours suivant le nombre de jours demandés (jusqu'à 5 : sModeAnnonce=5prochainsJours)
  if (sModeAnnonce != 'ParType') {
    var iNombreJoursMax=0;
    iNombreJoursMax = parseInt(sModeAnnonce);
    //debuglog("N prochains jours à annoncer =" + iNombreJoursMax);
    //rechercher pour chaque prochain jour en partant de iNombreJoursMax si ce jour est une collecte ou un rappel
    sMessage = sMessage + rechercheProchainsJours(iNombreJoursMax,tTypeRappel, tListeDatesRappel, tJoursRappel, tMatinOuSoirRappel,  "Rappel", tDateRappel);
    
  }
  else {
    // Annonce par type de rappel
    var bDateEgale = false;
    sMessage = sMessage + "Les prochaines dates de rappel sont : ";
    // recherche pour chaque type de rappel VALIDE la prochaine date de rappel 
    for (var i=0; i<tTypeRappel.length; i++) {
      if (tTypeRappel[i]!='aucune') {
	tDateRappel[i] = prochainJour (dDateDuJour, bDateEgale, tJoursRappel[i], tListeDatesRappel[i], tMatinOuSoirRappel[i]); 
	sMessage = sMessage + "Pour les "+tTypeRappel[i] + " "  + tDateRappel[i]+". ";
      }
    }  
  }
  
  debuglog(sMessage);
  karotz.button.addListener(buttonListener);
  karotz.tts.start(sMessage, "fr", exitFunction );  
}

// gestion de la VM (karotz_ip) avoir un fichier vm.js dans le réperoire Karotz 
if (typeof(instanceName)=='undefined'){ include("../vm.js");}
karotz.connectAndStart(karotz_ip, 9123, onKarotzConnect, {});
