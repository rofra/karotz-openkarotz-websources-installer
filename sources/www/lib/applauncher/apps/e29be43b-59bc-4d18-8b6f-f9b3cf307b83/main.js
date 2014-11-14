include("util.js");

/****************/
/* Instructions */
/****************/

// Adresse IP du Karotz
var karotz_ip = "localhost";

// URL Jingle SNCF
var jingle_sncf = "/usr/karotz/apps/e29be43b-59bc-4d18-8b6f-f9b3cf307b83/jingle_sncf.mp3";

// Définition de la ville de départ et d'arrivée
var gare_depart = params[instanceName].gare_depart;
var gare_arrivee = params[instanceName].gare_arrivee;
var url_directe = params[instanceName].url_directe;

// Traitement du nom des gares pour l'URL
var url_gare_depart = gare_depart.replace(/\s+/g,'+');
var url_gare_arrivee = gare_arrivee.replace(/\s+/g,'+');

// Définition du nombre de trains à annoncer
var nb_desire = params[instanceName].nb_desire;

// Téléchargement de la page HTML mobi.transilien adaptée
if (url_directe == "") {
    var transilien_web = http.get("http://transilien.mobi/TempReelSaisieSubmit.do?debutDepart="+url_gare_depart+"&debutArrivee="+url_gare_arrivee);
}
else {
    var transilien_web = http.get(url_directe);
}

// Définition des données : Nom du train, destination, voie, horaire (Sous forme de tableaux)
var heure_def = transilien_web.match(/[0-2][0-9]h[0-5][0-9]/g);
var dest_et_quai = transilien_web.match(/[A-Z0-9][A-Z\- ]*&nbsp;/g);
var nom_train = transilien_web.match(/\s{2}[A-Z]{4}\s{2}/g);

// Traitement des données (OK pour les heures)
var dest_et_quai_def = new Array();
for (var i = 0; i < dest_et_quai.length; i++) {
    dest_et_quai[i] = dest_et_quai[i].toLowerCase();
    dest_et_quai_def[i] = dest_et_quai[i].replace('&nbsp;','');
}

// var nom_train_def = nom_train;
var nom_train_def = new Array();
for (var j = 0; j < nom_train.length; j++) {
    nom_train[j] = nom_train[j].toLowerCase();
    nom_train_def[j] = nom_train[j].replace(/^\s+/g,'').replace(/\s+$/g,'');
}

// Définition du nombre d'entrées disponibles
var nb_entrees = nom_train.length;

// Fonction permettant d'arrêter le programme par double pression sur le bouton
var buttonListener = function(event) {
    if (event == "DOUBLE") {
    karotz.multimedia.stop();
    karotz.tts.stop();
    exit();
    }
    return true;
}

// Fonction d'arrêt
var exitFunction = function(event) {
    if((event == "CANCELLED") || (event == "TERMINATED")) {
        exit();
    }
    return true;
}







/*************/
/* Programme */
/*************/

var onKarotzConnect = function(data) {
    karotz.led.light("000000");
    karotz.led.pulse("4FFF68", 2000, -1);
    karotz.button.addListener(buttonListener);
    karotz.multimedia.play(jingle_sncf, function(event) {
    if (event == "TERMINATED") {
        karotz.tts.start("<prosody rate = '-0.4'>Info traffic Transsilien SNCF.<break time='1000ms'/>Le prochain train partant de "+gare_depart+", et desservant la gare de "+gare_arrivee+", sera un train <break time='200ms'/>"+nom_train_def[0]+"<break time='200ms'/> à destination de <break time='200ms'/>"+dest_et_quai_def[1]+"<break time='800ms'/>Il empruntera le quai <break time='100ms'/>"+dest_et_quai_def[0]+"<break time='100ms'/> à <break time='100ms'/>"+heure_def[1]+"<break time='1000ms'/>.</prosody>", 'fr', function(event) {
        if ((event == "TERMINATED") && (nb_entrees >= 2) && (nb_desire >= 2)) {
            karotz.tts.start("<prosody rate = '-0.4'>Il sera suivi d'un train <break time='200ms'/>"+nom_train_def[1]+"<break time='200ms'/> à destination de <break time='200ms'/>"+dest_et_quai_def[3]+"<break time='100ms'/> qui empruntera le quai <break time='100ms'/>"+dest_et_quai_def[2]+"<break time='100ms'/> à <break time='100ms'/>"+heure_def[2]+"<break time='1000ms'/>.</prosody>", 'fr', function(event) {
            if ((event == "TERMINATED") && (nb_entrees >= 3) && (nb_desire >= 3)) {
                karotz.tts.start("<prosody rate = '-0.4'>Puis d'un train <break time='200ms'/>"+nom_train_def[2]+"<break time='200ms'/> à destination de <break time='200ms'/>"+dest_et_quai_def[5]+"<break time='100ms'/> qui empruntera le quai <break time='100ms'/>"+dest_et_quai_def[4]+"<break time='100ms'/> à <break time='100ms'/>"+heure_def[3]+"<break time='1000ms'/>. Bon voyage !</prosody>", 'fr', exitFunction);
                }
            else if (event == "TERMINATED") {
                karotz.tts.start("<prosody rate = '-0.4'>Bon voyage !</prosody>", 'fr', exitFunction);
                }
                });
            }
        else if (event == "TERMINATED") {
            karotz.tts.start("<prosody rate = '-0.4'>Bon voyage !</prosody>", 'fr', exitFunction);
            }
            });
        }
    });
}

karotz.connectAndStart(karotz_ip, 9123, onKarotzConnect, {});


/* Copyright (C) 2012 Privé Yann

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program. If not, see <http://www.gnu.org/licenses/> */
