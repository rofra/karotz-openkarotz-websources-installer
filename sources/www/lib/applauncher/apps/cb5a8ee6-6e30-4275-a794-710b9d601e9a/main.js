include("util.js");

/****************/
/* Instructions */
/****************/

// Adresse IP du Karotz
var karotz_ip = "localhost"

// Définition de d'URL du flux radio à lire
var radio_choisie = params[instanceName].radio_choisie;

if (radio_choisie == 1) {
    var url_radio = "http://vipicecast.yacast.net/europe1.m3u";
    }
else if (radio_choisie == 2) {
    var url_radio = "http://vipicecast.yacast.net/rmc";
    }
else if (radio_choisie == 3) {
    var url_radio = "http://viphttpplayers.yacast.net/V4/bfm/bfm.m3u";
    }
else if (radio_choisie == 4) {
    var url_radio = "http://streaming.radio.rtl.fr/rtl-1-44-96";
    }
else if (radio_choisie == 5) {
    var url_radio = "http://www.tv-radio.com/station/france_inter_mp3/france_inter_mp3-128k.m3u";
    }
else if (radio_choisie == 6) {
    var url_radio = "http://www.tv-radio.com/station/france_info/france_info.m3u";
    }
else {
    var url_radio = params[instanceName].autre_radio;
    }

// Fonction empêchant l'arrêt du programme au bout de 15 min
var pingKarotz = function(event) {
    ping();
    setTimeout(615000, function() { pingKarotz();
    return true; });
}

// Fonction permettant d'arrêter l'écoute
var buttonListener = function(event) {
    if (event == "DOUBLE") {
        karotz.multimedia.stop();
        exit();
    }
    return true;
}

// Fonction d'arrêt
var exitFunction = function(event) {
    if ((event == "CANCELLED") || (event == "TERMINATED")) {
        exit();
    }
    return true;
}

// Durée au préalable définie par l'utilisateur sur le site, *60000 pour obtenir la durée en ms
var duree = params[instanceName].duree*60000;

// Fonction "snooze" = Fin de la durée d'écoute + annonce d'un message pour le fun :D
var snooze = function(event) {
    karotz.multimedia.stop();
    karotz.tts.start("<prosody rate = '-0.33'>Il est temps de se lever ! Bonne journée !</prosody>", 'fr', exitFunction);
    return true;
}







/*************/
/* Programme */
/*************/

var onKarotzConnect = function(data) {
    karotz.led.light("000000");
    karotz.led.pulse("75FF00", 2000, -1);
    karotz.button.addListener(buttonListener);
    pingKarotz();
    setTimeout(duree, snooze);
    karotz.multimedia.play(url_radio);
}

karotz.connectAndStart(karotz_ip, 9123, onKarotzConnect, {});


/* Copyright (C) 2012 Privé Yann

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program. If not, see <http://www.gnu.org/licenses/> */
