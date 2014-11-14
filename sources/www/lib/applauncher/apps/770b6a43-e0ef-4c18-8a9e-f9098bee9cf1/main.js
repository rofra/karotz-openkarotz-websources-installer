include("util.js");

var sounds=[
    "http://www.litteratureaudio.net/Jacob_et_Wilhelm_Grimm_-_Petit_Frere_Petite_Soeur.mp3",
    "http://www.litteratureaudio.net/Jacob_et_Wilhelm_Grimm_-_Les_Presents_des_gnomes.mp3",
    "http://www.litteratureaudio.net/Jacob_et_Wilhelm_Grimm_-_Le_fidele_Jean.mp3",
    "http://www.litteratureaudio.net/Jacob_et_Wilhelm_Grimm_-_Les_deux_freres.mp3",
    "http://www.litteratureaudio.net/Jacob_et_Wilhelm_Grimm_-_Hansel_et_Gretel.mp3",
    "http://www.litteratureaudio.net/Jacob_et_Wilhelm_Grimm_-_Le_serpent_blanc.mp3",
    "http://www.litteratureaudio.net/Jacob_et_Wilhelm_Grimm_-_l_eau_de_la_vie.mp3",
    "http://www.litteratureaudio.net/Jacob_et_Wilhelm_Grimm_-_Les_nains_magiques.mp3",
    "http://www.litteratureaudio.net/Jacob_et_Wilhelm_Grimm_-_La_petite_table_l_ane_et_le_baton.mp3",
    "http://www.litteratureaudio.net/Jacob_et_Wilhelm_Grimm_-_Le_pecheur_et_sa_femme.mp3",
    "http://www.litteratureaudio.net/Les_freres_Grimm_-_Blanche_Neige.mp3",
    "http://www.litteratureaudio.net/Jacob_et_Wilhelm_Grimm_-_La_gardeuse_d_oies_.mp3",
    "http://www.litteratureaudio.net/Contes_de_Grimm_-_Les_Wichtelmaenner.mp3",
    "http://www.litteratureaudio.net/Contes_de_Grimm_-_Le_diable_aux_trois_cheveux_d_or.mp3",
    "http://www.litteratureaudio.net/Contes_de_Grimm_-_Les_sept_corbeaux.mp3"
];

var soundPath = sounds[Math.floor(Math.random()*sounds.length)];

var karotz_ip="localhost"

var buttonListener = function(event) {
    if (event == "DOUBLE") {
        karotz.tts.stop();
        exit();
    }
    return true;
}

var exitFunction = function(event) {
    if((event == "CANCELLED") || (event == "TERMINATED")) {
        exit();
    }
    return true;
}

var onKarotzConnect = function(data) {
    karotz.button.addListener(buttonListener);
    karotz.multimedia.play(soundPath, exitFunction);
}

karotz.connectAndStart(karotz_ip, 9123, onKarotzConnect, {});
