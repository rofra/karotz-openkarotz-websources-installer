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
// ********************************************************************************************************************************************************************
// *  bibliothèque : BibliothequegestionDates bilbliothèque utilisées par les applications Poubelles et Karotzaire pour préparer les annonces des rappels et des      *
// *  collectes suivants la date du jour et les dates ou les jours programmées                                                                 Version : 0.0.1        *
// *  Objectifs :    1 fonction de debuglog pour mode mbarqué et 12 fonctions de gestion des dates  : ajouterNjours, constructionDatestravecDate,                     *
// *  conversionDatestrToDate, prochaineDateSuivantPeriode, prochaineDateListeDates, prochaineDate, RecherchePremierJour, prochainJour,  definitionNProchainsMoments  *
// *  constituerMessage, finaliserMessage, rechercheProchainsJours                                                                                                    *
// *                                                                                                                                                                  *
// *  Historique :                                                                                                                                                    *
// *  0.0.1   12 fonctions construite à partir du main de 01-app_Poubelles v0.1.9                                                                                     *
// *  0.0.3   Modification de prochaineDate et prochaineDateSuivantPeriode (prise en compte de 1erMardiMois                                                           *
// *  0.0.3B   correction bug dans le cas de l'utilisation de prochaineDateSuivantPeriode (prise en compte de 1erMardiMois                                            *
// ********************************************************************************************************************************************************************


var dDateDuJour = new Date();
var tab_jour=new Array("dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi");
var tab_mois=new Array("Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Décembre");

//gestion des messages dans le mode annonce par Prochains Jours jusqu'à 18 moments : (aujourd'hui + 5 jours)*3 (sModeAnnonce=5ProchainsJours)
var tMessageNMoments = new Array ("", "", "", "", "","", "", "", "", "","", "", "", "", "","", "", "");
//définition des 18 prochains moments (jour matin ou soir)  : aujourd'hui, ce matin, ce soir, lundi, lundi matin, lundi soir, etc
var tProchainsMoments = new Array ("aujourdui", "ce matin", "ce soir", "", "","", "", "", "", "","", "", "", "", "","", "", "");


// fonction qui permets l'affichage des logs en embarqué via le port série (mini usb)
var debuglog = function(string) {
   var d = new Date();
   var hh = "" + d.getHours();
   var mm = d.getMinutes();
   if (mm < 10) { mm = "0" + mm; }
   hh = hh + 'h' + mm + " : ";
   if (karotz_ip == 'localhost') {
//       karotz.serial.write(hh + string + '\n\r');
   }
   else log(hh + string);
   return true;
}

//fonction qui modifie une date en ajoutant le nombre de jours passé en paramètre et qui conserve l'heure (même si changement d'heure d'été ou hiver) 
var ajouterNjours = function (dateAModifier, dateReference, iNombreJours) {

  //on mémorise l'heure de la date avant changement 
  var iHeure=dateReference.getHours();
  // attention il peut y avoir une heure de décalage sur la date calculée ci-dessous avec le passage heure hiver/été prise en compte parsetTime
  dateAModifier.setTime(dateReference.getTime() + iNombreJours * 24 * 3600 * 1000);
  // on force l'heure initiale pour permettre les comparaisons de dates
  dateAModifier.setHours(iHeure);
}

// fonction qui renvoie une date en format français sous forme de string (ex :samedi 21 avril 2012 soir) à partir d'un objet date passé en paramètre et la chaîne soir ou matin
// ou retourne Le jour prochain (exemple "jeudi prochain") si bComplete est à false et si la prochaine date est dans les 7 jours qui viennent 
var constructionDatestravecDate = function (date, bComplete, sSoirOuMatin) {  
  var sDateConstruite = "";
  var dJ7=new Date();
  // attention il peut y avoir une heure de décalage sur la date calculée ci-dessous avec le passage heure hiver/été prise en compte parsetTime
  //dJ7.setTime(dDateDuJour.getTime() + 7 * 24 * 3600 * 1000);
  ajouterNjours(dJ7, dDateDuJour, 7);
  if ((!bComplete) && (date < dJ7) ) {
    sDateConstruite = tab_jour[date.getDay()] + " " +sSoirOuMatin;
  }
  else {
    sDateConstruite = tab_jour[date.getDay()] +" "+ date.getDate()+" "+tab_mois[date.getMonth()]+" "+date.getFullYear()+ " "+ sSoirOuMatin;
  }
  return sDateConstruite;
}

// Ancienne fonction qui renvoie un objet date à partir d'une date sous format string JJ/MM/AAAAA passée en paramètre
var conversionDatestrToDate = function (datestr) {
  var date= new Date();
  var mois = 0, jour=0;
  
  // initialise la date avec les même heures et les mêmes minutes du jour pour permettre les comparaisons de dates
  date.setTime(dDateDuJour.getTime());
  if (isFinite(datestr.substring(0,2))) { 
    // Supprimer le 0 des jours <10 exemple 08 remplacer par 8
    if (datestr.substring(0,1)=="0") {
      var reg=new RegExp("[0]{1}","g");
      jour= parseInt(datestr.substring(0,2).replace(reg,""));
    }
    else { jour= parseInt(datestr.substring(0,2)); }
    date.setDate (jour); 
  }
  if (isFinite(datestr.substring(3,5))) {
    // Supprimer le 0 des mois <10 exemple 08 remplacer par 8
    if (datestr.substring(3,4)=="0") {
      var reg=new RegExp("[0]{1}","g");
      mois= parseInt(datestr.substring(3,5).replace(reg,""))-1;
    }
    else { mois= parseInt(datestr.substring(3,5))-1; }
    //debuglog ("mois :"+mois);
    date.setMonth (mois); 
  }
  if (isFinite(datestr.substring(6))) { date.setFullYear (parseInt(datestr.substring(6))); }
  
  debuglog("date :"+ datestr + "convertie en :" + date.toLocaleString());
  
  return date;
}

// ********************************************************************************************************************************************
// * Nom fonction : conversionDatestrToDate2  modifiée dans la version 0.0.2                                                                   * 
// * Objectif     : renvoie un objet date à partir d'une date sous format string JJ/MM/AAAAA ou J/M/AAAA passée en paramètre                              *
// * paramètre datestr = date à convertir                                                                                              *
// ********************************************************************************************************************************************
var conversionDatestrToDate2 = function (datestr) {
  var date= new Date();
  var mois = 0, jour=0;
    
  //debuglog ("Longueur date ="+datestr.length);
  var reg=new RegExp("[/]+","g");
  var tableauDate=datestr.split(reg);
  //debuglog(tableauDate.join(", "));
  
  // initialise la date avec les même heures et les mêmes minutes du jour pour permettre les comparaisons de dates
  date.setTime(dDateDuJour.getTime());
  
  // le premier élément contient le jour 
  if (isFinite(tableauDate[0])) {
    // Supprimer le 0 des jours <10 exemple 08 remplacer par 8
    if (tableauDate[0].substring(0,1)=="0") {
      jour= parseInt(tableauDate[0].substring(1));
    }
    else { jour= parseInt(tableauDate[0]); }
    date.setDate (jour); 
  }
  
  // le deuxième élément contient le mois
  if (isFinite(tableauDate[1])) {
    // Supprimer le 0 des mois <10 exemple 08 remplacer par 8
    if (tableauDate[1].substring(0,1)=="0") {
      mois= parseInt(tableauDate[1].substring(1))-1;
    }
    else { mois= parseInt(tableauDate[1])-1; }  
    //debuglog ("mois :"+mois);
    date.setMonth (mois);
  }
  
  if (isFinite(tableauDate[2])) { date.setFullYear (parseInt(tableauDate[2])); }
  debuglog("date :"+ datestr + "convertie en :" + date.toLocaleString());
  
  return date;
}

// ********************************************************************************************************************************************
// * Nom fonction : CalculIndiceJour  arrivée dans la version 0.0.2                                                                           * 
// * Objectif     : calcule et renvoie l'indice du jour dans tab_jours  exemple 0 pour dimanche                                               *
// * paramètre sJourSemaine = jour de la semaine                                                                                              *
// ********************************************************************************************************************************************
var CalculIndiceJour = function (sJourSemaine) {
  var i=0;
  bTrouve=false;
  while ((i < tab_jour.length) && !bTrouve) {
    if (sJourSemaine.toLowerCase() == tab_jour[i]) { 
      bTrouve=true;
    }
    else {i=i+1;}
  }
  debuglog("i="+i);
  return i;
}

// ********************************************************************************************************************************************
// * Nom fonction : ProchaineDateSuivantJourMois  arrivée dans la version 0.0.2                                                               * 
// * Objectif     : calcule et renvoie la prochaine date sous forme de string à partir du Nième jour dans le mois  (exemple "1:Mardi")        *
// * si date trouvée < aujourd'hui +7 renvoie seulement Jour soir (ou matin) prochain exemple : "mardi soir prochain"                         *
// * paramètre dDateDebut = date à partir de laquelle on recherche la prochaine date                                                          *
// * paramètre bDateEgale =vrai alors renvoie seulement si date trouvée = ddateDebut (utilisée pour le mode annonce n prochains jours)                                                           *
// * paramètre sListeDates = contient le Neme jour du mois à rechercher exemple 1:mardi pour le 1er Mardi du Mois ou 2:Jeudi pour2emeJeudiMois*
// * paramètre sSoirOuMatin = soir ou matin                                                                                                   *
// ********************************************************************************************************************************************
var ProchaineDateSuivantJourMois = function (dDateDebut, bDateEgale, sNiemJourSemaine, sSoirOuMatin) {
  var sProchaineDateStr ="non connue"; 
  // rechercher la position dans le mois (Nème jour du mois) et le jour concerné (exemple mardi)
  debuglog ("Longueur ="+sNiemJourSemaine.length);
  var reg=new RegExp("[:]+","g");
  var tableauPeriode=sNiemJourSemaine.split(reg);
  debuglog(tableauPeriode.join(", "));
  // le premier élément contient la position du jour dans le mois  exemple 2 = 2ème mardi du mois 
  var iNombrePosition=parseInt(tableauPeriode[0]);
  // le deuxième élément contient le jour du mois concerné exemple mardi
  var sJour=tableauPeriode[1];
  // rechercher l'indice de sJour
  var iIndiceJour = CalculIndiceJour(sJour);
  
  //rechercher le prochain jour en question par rapport au 1er jour du mois (exemple 1er mardi du mois)
  // repartir du 1er du mois
  var dDate = new Date();
  var iMois = dDateDebut.getMonth();
  var iAnnee = dDateDebut.getFullYear();
  // initialise la date avec les même heures et les mêmes minutes du jour pour permettre les comparaisons de dates
  dDate.setTime(dDateDebut.getTime());
  var iJourMois = 0;
  
  while ( (dDate<dDateDebut) || ((dDate.toLocaleString()==dDateDebut.toLocaleString()) && (iJourMois==0)) ) {
    dDate.setMonth(iMois);
    dDate.setFullYear(iAnnee);
    dDate.setDate(1);
    //calculer le nombre de jour pour atteindre le 1er jour du mois (exemple 1er mardi) à partir du 1er du mois  
    if (iIndiceJour >= dDate.getDay()) {
      iJourMois = iIndiceJour - dDate.getDay()+1;
    } 
    else {iJourMois = 7-(dDate.getDay()-iIndiceJour)+1;}  
    debuglog("iJourMois ="+iJourMois);
    // rechercher le Nème iNombreposition jour (exemple mardi) du mois 
    dDate.setDate(iJourMois + ((iNombrePosition -1)* 7));
    //debuglog("dDate ="+dDate.toLocaleString()+ "dDateDebut ="+dDateDebut.toLocaleString());
    if (dDate < dDateDebut){
     if (iMois==11) {
       iMois=0;
       iAnnee=iAnnee+1;
     }
     else {iMois=iMois+1;} 
    }
  }
  var sDate= dDate.getDate()+"/"+(dDate.getMonth()+1)+"/"+dDate.getFullYear();
  debuglog("Nème="+iNombrePosition+" "+sJour+" du mois = "+sDate);
  //vérifier si la date trouvée est correcte suivant dDateDebut et bDateEgale
  return prochaineDateListeDates(dDateDebut, bDateEgale, sDate, sSoirOuMatin);
}

// fonction qui calcule et renvoie la prochaine date sous forme de string à partir d'une période et d'une date ("njours:JJ/MM/AAAA") en paramètre et l'information soir ou matin passée en paramètre
// si bDateEgale =vrai alors renvoie seulement si date trouvée = ddateDebut
// renvoie seulement Jour soir (ou matin)  prochain si date trouvée < aujourd'hui +7 exemple : "mardi soir prochain" 
var prochaineDateSuivantPeriode = function (dDateDebut, bDateEgale, sListeDates, sSoirOuMatin) {
  var sProchaineDateStr ="non connue";
  debuglog ("Longueur ="+sListeDates.length);
  var reg=new RegExp("[:]+","g");
  var tableauPeriode=sListeDates.split(reg);
  debuglog(tableauPeriode.join(", "));
  // le premier élément contient le nombre de jours de période exemple 15jours
  var iNombreJours=parseInt(tableauPeriode[0]);
  // le deuxième élément contient la date initiale de la période
  var datei=conversionDatestrToDate2(tableauPeriode[1]);
  //on recherche la prochaine période (date) à partir de datei et on la compare à dDateDebut
  var bDateTrouvee=false;
  var bArret=false;
  while  (!bDateTrouvee && !bArret) {
    if ((bDateEgale && datei.toLocaleString() == dDateDebut.toLocaleString()) || (!bDateEgale && datei>= dDateDebut)) {
      if (datei.toLocaleString() == dDateDuJour.toLocaleString()) {
	if (sSoirOuMatin!="") {sProchaineDateStr = "ce "+ sSoirOuMatin;} else {sProchaineDateStr = "aujourdui";}
      }
      else {sProchaineDateStr = constructionDatestravecDate (datei, false, sSoirOuMatin);}
      bDateTrouvee = true;
      debuglog(sProchaineDateStr);
    }
    if (bDateEgale && datei> dDateDebut) {bArret=true;}
    ajouterNjours(datei, datei, iNombreJours);
    debuglog("datei :"+datei.toLocaleString()+"; dDateDuJour :"+dDateDuJour.toLocaleString());
  }
  return sProchaineDateStr;
}
 
// fonction qui calcule et renvoie la prochaine date sous forme de string à partir d'une liste de dates passée en paramètre et l'information soir ou matin passée en paramètre
// si bDateEgale =vrai alors renvoie seulement si date trouvée = ddateDebut
// renvoie seulement Jour soir (ou matin)  prochain si date trouvée < aujourd'hui +7 exemple : "mardi soir prochain" 
var prochaineDateListeDates = function (dDateDebut, bDateEgale, sListeDates, sSoirOuMatin) {
  var sProchaineDateStr ="non connue";
  debuglog ("Longueur ="+sListeDates.length);
  var reg=new RegExp("[ ;,]+","g");
  var tableauDates=sListeDates.split(reg);
  var bDateTrouvee=false;
  var i=0;
  while  (!bDateTrouvee && i<tableauDates.length) {
    var datei=conversionDatestrToDate2(tableauDates[i]);
    if ((bDateEgale && datei.toLocaleString() == dDateDebut.toLocaleString()) || (!bDateEgale && datei>= dDateDebut)) {
      if (datei.toLocaleString() == dDateDuJour.toLocaleString()) {
	if (sSoirOuMatin!="") {sProchaineDateStr = "ce "+ sSoirOuMatin;} else {sProchaineDateStr = "aujourdui";}
      }
      else {sProchaineDateStr = constructionDatestravecDate (datei, false, sSoirOuMatin);}
      bDateTrouvee = true;
      debuglog(sProchaineDateStr);
    }
    i=i+1;
  }
  return sProchaineDateStr;
}

// ******* modifié en 0.0.2
// fonction qui calcule et renvoie la prochaine date sous forme de string à partir d'une liste de dates (ou nombre de jours avec une date) passée en paramètre et l'information soir ou matin passée en paramètre
// si bDateEgale =vrai alors renvoie seulement si date trouvée = ddateDebut
// renvoie seulement Jour soir (ou matin)  prochain si date trouvée < aujourd'hui +7 exemple : "mardi soir prochain" 
var prochaineDate = function (dDateDebut, bDateEgale, sListeDates, sSoirOuMatin) {
  // rechercher s'il s'agit d'une période de jours (exemple : "15jours:15/5/2012") ou Nème de mois (exmple 1er mardi du mois : 1:mardi) ou d'une liste de dates 
  var reg=new RegExp("(jour)","gi");
  var bRes=sListeDates.match(reg);
  if (bRes) {
    return prochaineDateSuivantPeriode(dDateDebut, bDateEgale, sListeDates, sSoirOuMatin);
  }
  else {
    var reg2=new RegExp("(:)","gi");
    bRes=sListeDates.match(reg2);
    if (bRes) {
        return ProchaineDateSuivantJourMois(dDateDebut, bDateEgale, sListeDates, sSoirOuMatin);
    }
    else { 
    return prochaineDateListeDates(dDateDebut, bDateEgale, sListeDates, sSoirOuMatin);
    }
  }
}

// retourne le premier jour de la semaine trouvée dans sJours (dimanche; lundi, ...) en commencant par l'indice i (0=dimanche , 1= lundi, ...) de la semaine
// si bJourIseulement on cherche seulement si l'indice i est un jour appartenant à sJours
var RecherchePremierJour = function (sJours, i, bJourISeulement, sSoirOuMatin) {
  var sProchainJour ="non connu";
  var bArret = false;
  while  (!bArret && i<tab_jour.length) {
    var reg1=new RegExp("("+tab_jour[i]+")", "gi");
    var bTrouve= sJours.match(reg1);
    if (bTrouve) {
      if (tab_jour[dDateDuJour.getDay()]==tab_jour[i]) {
	if (sSoirOuMatin!="") {sProchainJour = "ce "+ sSoirOuMatin;} else {sProchainJour = "aujourdui";}
      }
      else {sProchainJour = tab_jour[i]+" "+sSoirOuMatin;}
      bArret=true;
    }
    if (bJourISeulement) {bArret = true;}
    i = i+1; 
  }
  return sProchainJour;
}

// Renvoie la prochaine date de collecte correspondant  soit à un jours de la semaine soit à une liste de dates (si sJours="liste dates")
var prochainJour = function (dDateDebut, bDateEgale, sJours, sListeDates, sSoirOuMatin) {
  var sProchainJour ="non connu";
  debuglog("sJours :"+sJours);
  // si c'est une liste de dates rechercher la prochaine date sinon rechercher le prochain jour de la semaine
  var reg1=new RegExp("(liste)","gi");
  var bRes=sJours.match(reg1);
  if (bRes) {return prochaineDate (dDateDebut, bDateEgale, sListeDates, sSoirOuMatin);}
  else {
    //on cherche le prochain jour de la semaine qui est dans les jours de collecte
    sProchainJour= RecherchePremierJour (sJours, dDateDebut.getDay(),bDateEgale, sSoirOuMatin);
    // s'il n'est pas trouvé on cherche le premier jour de la semaine prochaine
    if (sProchainJour=="non connu"&& !bDateEgale) {sProchainJour= RecherchePremierJour (sJours, 0, bDateEgale, sSoirOuMatin);}
    debuglog("sProchainJour :"+ sProchainJour);
    return sProchainJour;
  }
}

// défini les 18 prochains moments (maximum) : jour, matin ou soir suivant la date du jour et le nombre de jours demandés
var definitionNProchainsMoments = function (nNombreJours) {
 var iProchainsMoments=3; iProchainsJours=1;
 var iModulo7=0;
 while (iProchainsJours < nNombreJours+1) {
  iModulo7= (dDateDuJour.getDay()+iProchainsJours) % 7; 
  tProchainsMoments[iProchainsMoments]=tab_jour[iModulo7];
  iProchainsMoments=iProchainsMoments+1;
  tProchainsMoments[iProchainsMoments]=tab_jour[iModulo7]+ " matin";
  iProchainsMoments=iProchainsMoments+1;
  tProchainsMoments[iProchainsMoments]=tab_jour[iModulo7]+ " soir";
  iProchainsMoments=iProchainsMoments+1;
  iProchainsJours=iProchainsJours+1;
 }
 debuglog(tProchainsMoments.join(", "));
}

// fonction qui construite les messages (pour SModeAnnonce=NJoursProchains) pour chaque jour suivant le jour trouvé pour une collecte ou un rappel
var constituerMessage = function(sMomentTrouve, sRappel) {
  var i=0;
  var bTrouve =false;
  while (!bTrouve && i<tProchainsMoments.length) {
   if (sMomentTrouve==tProchainsMoments[i]) {
     tMessageNMoments[i]=tMessageNMoments[i] + " collecte " + sRappel +"," ;
     bTrouve= true;
   }
   i=i+1;
  }
}

// fonction qui finalise un Message  (pour SModeAnnonce=NJoursProchains) à partir de tous les messages constitués pour chaque moment (ce matin, ce soir, etc.)
var finaliserMessage = function () {
  var sMessageConstruit="";
  var sMessageComplet="";
  for (i=0; i<tProchainsMoments.length; i++) {
    if (tMessageNMoments[i] != "") {sMessageConstruit = sMessageConstruit + " "+tProchainsMoments[i] + tMessageNMoments[i];}
  }
  if (sMessageConstruit=="") { sMessageComplet = "Il n'y a pas de collecte pour aujourdui et les "+ parseInt(sModeAnnonce)+" prochaines jours";}
  else {sMessageComplet = "Vos collectes pour aujourdui et les "+ parseInt(sModeAnnonce)+" prochains jours sont :"+sMessageConstruit;}
  return sMessageComplet;
}
// fonction qui recherche pour les prochains jours les collectes et les rappels et qui constitue les messages correspondant (utilisé dans le mode sAnnonce=NprochainsJours)
var rechercheProchainsJours = function (iNombreJoursMaximum) {
  var dateDebut = new Date();
  var bDateEgale = true;
      
  definitionNProchainsMoments(iNombreJoursMaximum);
  //rechercher pour chaque prochain jour en partant de iNombreJoursMaximum si cette est une collecte ou un rappel
  while (iNombreJoursMaximum >=0) {
    // on initialise la datedebut à partir de date du jour + nombre de jours maximum j (indiqué dans sModeAnnonce)
    ajouterNjours(dateDebut, dDateDuJour, iNombreJoursMaximum);
    debuglog("recherch collecte pour dateDebut :"+dateDebut.toLocaleString()+"; dDateDuJour :"+dDateDuJour.toLocaleString());
    // attention il peut y avoir une heure de décalage sur la date calculée ci-dessous avec le passage heure hiver/été prise en compte parsetTime
    // dateDebut.setTime(dDateDuJour.getTime() + iNombreJoursMaximum * 24 * 3600 * 1000);
    for (var i=0; i<tTypeCollecte.length; i++) {
      if (tTypeCollecte[i] != 'aucune') {
	//regarder si le prochain jour datedebut est une date de collecte
	tDateCollecte[i] = prochainJour (dateDebut, bDateEgale, tJoursCollecte[i], tListeDatesCollecte[i], tMatinOuSoirCollecte[i]); 
	// regarder si le jour retourné est compris dans les Nprochains Jours et préparer le message
	constituerMessage(tDateCollecte[i], tTypeCollecte[i]);
      }
     }
     iNombreJoursMaximum=iNombreJoursMaximum-1;
  }
  return finaliserMessage(); 
}