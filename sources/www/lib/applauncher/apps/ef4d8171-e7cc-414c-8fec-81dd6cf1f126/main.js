///                      / \         / \  /                \
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
//  *  Application : app_Poubelles                                                                                                               Version : 0.2.3       *
//  *                                                                                                                                                                  *
//  *  Objectif :   Cette application vous annonce la prochaine date de collecte des verres et la prochaine date de collecte des végétaux en comparant la date du jour *
//  *  avec les dates de collecte préalablement saisies lors de la configuration de l'application                                                                      *
//  *                                                                                                                                                                  *
//  *  Historique :                                                                                                                                                    *
//  *  0.0.1 Première version sans gestion de l'affichage des messages en embarqué avec port série. Gestion de fichier des dates (récupération des dates de collecte)  *
//  *  0.0.2 correction sur la gestion des dates (fonctionne en VM mais pas en embarqué)                                                                               *
//  *  0.0.2                                                                                                                                                           *
//  *  0.0.4 Gestion de l'affichage des messages en embarqué                                                                                                           *
//  *  0.0.5 abandon de la gestion de fichiers qui ne fonctionne pas en embarqué (clé usb); Saisie des dates dans le screen.xml (limité à 250 caractères)              *
//  *  0.0.6 corrections diverses mais ne fonctionne toujours pas en embarqué                                                                                          *
//  *  0.0.7 corrections diverses mais ne fonctione toujours pas en embarqué                                                                                           *
//  *  0.0.8 corrections initialisation du port série retiré à tort depuis la v0.0.5                                                                                   *
//  *  0.0.9 corrections screen xml pas de nom pour le premier champs génére un bug depuis la v0.0.5; FONCTIONNE en EMBARQUE ! mais avec date anglaise                 *
//  *  0.1.0 construction de la date française car Karotz renvoie une date anglaise : date.tolocalstring(); ajout du matin et soir dans screen.xml                     *
//  *  0.1.1 Corrections mineures : suppression des blancs avant les points, suppression des majuscules à soir et matin dans screen.xml et affichage du message        *
//  *  0.1.2 gestion de 4 collectes : ordures ménagères, papiers, verres et végétaux; choix de jours (pas encore en fonction) ou de dates pour chaque collecte         *
//  *  0.1.3 correction du fichier sreen xml sect avec type "multiple" générait un plantage, remplacement de "multiple" par "multi"                                    *
//  *  0.1.4 amélioration du fichier xml pour 2 collectes avec jours et 2 collectes avec liste de date                                                                 *
//  *  0.1.5 à 9 debug initialisation en embarqué (mauvaise declaration de fonction  initscreenxml(data) qui rendait la main                                           *
//  *  0.2.0 2 Nouvelles fonctions : Annonce 5 prochains jours et gestions des collectes périodiques (toutes les 2 semaines ou les n jours). Util.Biblio.gestDatesv0.1 *
//  *  0.2.1 Idem  mais corrige bug en mode annonce N nouveaux jours (debuglog ne fonctionne pas en eùmbarqué avec un nombre même si casté dans serial.write)          *
//  *  0.2.2 suppression debug log avec port série qui bloque le lapin
//  *  0.2.3 main identique à 0.2.2 mais utilise BibliothequeGestionDates.js (V = 0.0.2) qui apporte la gestion des collectes de type tous les 2ème mardi du mois      *  
//  *  0.2.4 main identique à 0.2.2 mais utilise BibliothequeGestionDates.js (V = 0.0.3b) qui corrige un bug  sur la gestion  de type tous les 2ème mardi du mois      *  
//  ********************************************************************************************************************************************************************


include("util.js");

var karotz_ip = 'localhost';
var debugvm = false;

// gestion de 4 Collectes avec date à calculer, type de collecte  Jours de collecte, matin ou soir et liste de dates
var tDateCollecte= new Array ("", "", "", "");
var tTypeCollecte= new Array ("aucune", "aucune", "aucune", "aucune");
var tJoursCollecte= new Array ("", "", "", "");
var tMatinOuSoirCollecte = new Array ("", "", "", "");
var tListeDatesCollecte = new Array ("", "", "", "");


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
  var i = 0;
  debuglog ("debut initFromScreenXml");
  // initialisation collecte 1 i= 0 avec jours de collecte et sans date de collecte
  tTypeCollecte[i] = params[instanceName].sTypeCollecte1.slice(0);
  tJoursCollecte[i] = params[instanceName].sJoursCollecte1.slice(0) ;
  tListeDatesCollecte[i]="";
  tMatinOuSoirCollecte[i] = params[instanceName].sMatinOuSoirCollecte1.slice(0);
  
  // initialisation collecte 2 (i= 1) avec jours de collecte et sans date de collecte
  i=1;
  tTypeCollecte[i] = params[instanceName].sTypeCollecte2.slice(0);
  tJoursCollecte[i] = params[instanceName].sJoursCollecte2.slice(0);
  tListeDatesCollecte[i]="";
  tMatinOuSoirCollecte[i] = params[instanceName].sMatinOuSoirCollecte2.slice(0);
  
  // initialisation collecte 3 (i=2)sans jour de collecte avec dates de collecte
  i=2;
  tTypeCollecte[i] = params[instanceName].sTypeCollecte3.slice(0);
  tJoursCollecte[i] = "liste dates";
  tListeDatesCollecte[i]=params[instanceName].sDatesCollecte3.slice(0);
  tMatinOuSoirCollecte[i] = params[instanceName].sMatinOuSoirCollecte3.slice(0);
    
  // initialisation collecte 4 sans jour de collecte avec dates de collecte
  i=3;
  tTypeCollecte[i] = params[instanceName].sTypeCollecte4.slice(0);
  tJoursCollecte[i] = "liste dates";
  tListeDatesCollecte[i] = params[instanceName].sDatesCollecte4.slice(0);
  tMatinOuSoirCollecte[i] = params[instanceName].sMatinOuSoircollecte4.slice(0);
  
  for (i=0; i<4; i++) {
    debuglog("tJoursCollecte["+i+"] :"+tJoursCollecte[i]+ " pour la type de collecte : "+ tTypeCollecte[i]);
    debuglog("tListeDatesCollecte["+i+"] :"+tListeDatesCollecte[i]);
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
  //if (karotz_ip == 'localhost') { karotz.serial.open("/dev/ttyGS0", 9600);}
  debuglog ("debut application V0.2.3");
  
  sDateDuJour = constructionDatestravecDate (dDateDuJour, true, "");
  
  // initialisation des variables en mode VM (simulation) et en mode embarqué
  //en mode VM avoir un fichier screen.js dans la répertoire de l'application
  if (typeof(instanceName)=='undefined') {include ("./screen.js");} else {initFromScreenXml();}

  //Annonce par jour : aujourd'hui, demain, dans deux jours suivant le nombre de jours demandés (jusqu'à 5 : sModeAnnonce=5prochainsJours)
  if (sModeAnnonce != 'par type de collecte') {
    var iNombreJoursMax=0;
    iNombreJoursMax = parseInt(sModeAnnonce);
    //debuglog("N prochains jours à annoncer =" + iNombreJoursMax);
    //rechercher pour chaque prochain jour en partant de iNombreJoursMax si ce jour est une collecte ou un rappel
    sMessage = sMessage + rechercheProchainsJours(iNombreJoursMax);
  }
  else {
    // Annonce par type de collecte
    var bDateEgale = false;
    //sMessage = sMessage + "Les prochaines dates de collecte sont : ";
    // recherche pour chaque type de collecte VALIDE la prochaine date de collecte 
    for (var i=0; i<tTypeCollecte.length; i++) {
      if (tTypeCollecte[i] != 'aucune') {
	tDateCollecte[i] = prochainJour (dDateDuJour, bDateEgale, tJoursCollecte[i], tListeDatesCollecte[i], tMatinOuSoirCollecte[i]); 
	sMessage = sMessage + "La prochaine collecte des "+tTypeCollecte[i] + " est "  + tDateCollecte[i]+". ";
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
