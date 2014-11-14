include("util.js");

var karotz_ip = "localhost"//<= ATTENTION : ici votre adresse IP !
/*params[instanceName].lang; // 0 français 20 anglais 40 allemand 60 espagnol
params[instanceName].lang1; // 20 anglais 40 allemand 60 espagnol
params[instanceName].level; // (4 ou ou 11 ou 17


var karotz_ip = "192.168.1.46"//<= ATTENTION : ici votre adresse IP !
var lang = "20en"; // 0 = français, 20 = anglais
var lang1 = "60es"; // 0 = français, 20 = anglais
mon_level = 11; //(4 ou ou 11 ou 17
*/
var mon_debug = "";
var lum, coul;
var mon_nombre_aleatoire = 0;
var ready = 0;
var bouton = 0;
var puce = 0;
var je_parle = 0;
var deb = '<prosody rate="-12%">';
var fin = '</prosody>';
var level = new Array( 1, 2, 3, 4,5,6,7,8,10,12,16,9,11,13,14,16,17); //level 1 0 � 3    level 2 0 � 10

var earsListener = function(event, step, len) {
if ((event.indexOf("START_LEFT") >= 0) && (je_parle == 0) && (bouton == 1)) {
//**************************************************
        je_vois = lescouleurs[level[mon_nombre_aleatoire] + +params[instanceName].lang.substring(0,2)];
         karotz.tts.start(deb + je_vois + fin, params[instanceName].lang.substring(2,4), exitFunction);
       //je_vois = lescouleurs[level[mon_nombre_aleatoire] + +lang.substring(0,2)];
     //   karotz.tts.start(deb + je_vois + fin, lang.substring(2,4), exitFunction);
//*************************************************
    }
    if ((event.indexOf("START_LEFT") >= 0) && (je_parle == 0) && (puce == 1)) {
        //**************************************************
        je_vois = lescouleurs[coul + +params[instanceName].lang.substring(0, 2)];
        karotz.tts.start(deb + je_vois + fin, params[instanceName].lang.substring(2, 4), exitFunction);
        //je_vois = lescouleurs[level[mon_nombre_aleatoire] + +lang.substring(0,2)];
        //   karotz.tts.start(deb + je_vois + fin, lang.substring(2,4), exitFunction);
        //*************************************************
    }
    if ((event.indexOf("START_RIGHT") >= 0) && (je_parle == 0) && (bouton == 1)) {
//************************************************************************
        je_vois = lescouleurs[level[mon_nombre_aleatoire] + +params[instanceName].lang1.substring(0,2)];
         karotz.tts.start(deb + je_vois + fin, params[instanceName].lang1.substring(2,4), exitFunction);
      // je_vois = lescouleurs[level[mon_nombre_aleatoire] + +lang1.substring(0,2)];
      //  karotz.tts.start(deb + je_vois + fin, lang1.substring(2,4), exitFunction);
//************************************************************************
    }
    if ((event.indexOf("START_RIGHT") >= 0) && (je_parle == 0) && (puce == 1)) {
        //************************************************************************
        je_vois = lescouleurs[coul + +params[instanceName].lang1.substring(0, 2)];
        karotz.tts.start(deb + je_vois + fin, params[instanceName].lang1.substring(2, 4), exitFunction);
        // je_vois = lescouleurs[level[mon_nombre_aleatoire] + +lang1.substring(0,2)];
        //  karotz.tts.start(deb + je_vois + fin, lang1.substring(2,4), exitFunction);
        //************************************************************************
    }
    return true;
}

var trueColor = function(color) {
    if (color.length != 6) return color
    var r = color.substring(0, 2);
    var g = color.substring(2, 4);
    var b = color.substring(4, 6);
    if (color == "FF0000") { return color; }
    if (color == "00FF00") { return color; }
    if (color == "0000FF") { return color; }
    r = parseInt(r, 16);
    b = parseInt(b, 16);
    r = Math.floor(r * 0.45);
    b = Math.floor(b * 0.4);
    r = r.toString(16);
    b = b.toString(16);
    if (r.length == 1) r = "0" + r;
    if (b.length == 1) b = "0" + b;
    return r + g + b;
}
/* version VM
var rfidListener = function(data) {
    coul = data.color;
   if ((data.color == "1") && (data.type == "1")) coul = "5"
    if ((data.color == "5") && (data.type == "1")) coul = "1";
    je_vois = lescouleurs[coul];
    //var lum = trueColor(leslumieres[data.color]);
    mon_nombre_aleatoire = +coul - 1;
    karotz.led.light(trueColor(leslumieres[coul]));
    //mlog("rfid listener mon nombre aleatoire = " + mon_nombre_aleatoire);
    karotz.tts.start(deb + je_vois + fin, "fr", exitFunction);
  //  karotz.tts.start(deb + coul + fin, "fr", exitFunction);
    return true
}
*/
var rfidListener = function(data) {
    //var level = new Array(1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 16, 9, 11, 13, 14, 16, 17); //level 1 0 � 3    level 2 0 � 10
    puce = 1;
    bouton = 0;
	coul = 0;
    if (data.color == "RED") coul = 1; //dans level => 1 rouge
    if (data.color == "BLUE") coul = 2; //dans level => 2 bleue
    if (data.color == "GREEN") coul = 3; //dans level => 3 vert
    if (data.color == "YELLOW") coul = 4; //dans level => 4 jaune
    if (data.color == "PINK") coul = 5; //dans level => 5 rose
    if (data.color == "BLACK") coul = 6; //dans level => 6 noir
    if (data.color == "GREY") coul = 7; //dans level => 7 gris
    if (data.color == "ORANGE") coul = 8; //dans level => 10 rouge
    if (data.color == "PURPLE") coul = 9; //dans level => 1 rouge
    if (data.color == "WHITE") coul = 10; //dans level => 1 rouge
    if (data.color == "DARK_RED") coul = 11; //dans level => 1 rouge
    if (data.color == "DARK_BLUE") coul = 12; //dans level => 1 rouge
    if (data.color == "DARK_GREEN") coul = 13; //dans level => 1 rouge
    if (data.color == "DARK_YELLOW") coul = 14; //dans level => 1 rouge
    if (data.color == "BROWN") coul = 16;
    if ((data.color == "RED") && (data.type == "FLAT")) coul = 5
    if ((data.color == "PINK") && (data.type == "FLAT")) coul = 1;
    je_vois = lescouleurs[coul];
    //var lum = trueColor(leslumieres[data.color]);
   // mon_nombre_aleatoire = coul - 1;
    karotz.led.light(trueColor(leslumieres[coul]));
    //mlog("rfid listener mon nombre aleatoire = " + mon_nombre_aleatoire);
    karotz.tts.start(deb + je_vois + fin, "fr", exitFunction);
    //  karotz.tts.start(deb + coul + fin, "fr", exitFunction);
    return true
}


var buttonListener = function(event) {
    if (event == "DOUBLE") {
        karotz.tts.stop();
        exit();
    }
    if ((event == "SIMPLE") && (je_parle == 0)) {
        je_parle = 1;
        bouton = 1;
        puce = 0;
        var num_old = mon_nombre_aleatoire;
        //****************************************************
        while (num_old == mon_nombre_aleatoire) { mon_nombre_aleatoire = Math.floor(Math.random() * +params[instanceName].level); }
        // while (num_old == mon_nombre_aleatoire) { mon_nombre_aleatoire = Math.floor(Math.random() * mon_level); }
        //***************************************************************        
        karotz.led.light(trueColor(leslumieres[level[mon_nombre_aleatoire]]));
        je_vois = lescouleurs[level[mon_nombre_aleatoire]];
        //mlog("appui bouton mon nombre aleatoire = " + mon_nombre_aleatoire);
        karotz.tts.start(deb + je_vois + fin, "fr", exitFunction);
    }

    return true;
}
var exitFunction = function(event) {
    if ((event == "CANCELLED") || (event == "TERMINATED")) {
        je_parle = 0;
        return true;
    } 
    return true;
}
var je_vois = "Je vois ";
var letype = "heu je ne vois pas bien le type finalement....";
var lescouleurs= new Array();
lescouleurs[0] = "couleur non reconnue";
lescouleurs[1] = "rouge";//123
lescouleurs[2] = "bleu";//123
lescouleurs[3] = "verre";//123
lescouleurs[4] = "jaune";//123
lescouleurs[5] = "rose";//-23
lescouleurs[6] = "noir";//-23
lescouleurs[7] = "gris";//-23
lescouleurs[8] = "orange";//-23
lescouleurs[9] = "pourpre";//--3
lescouleurs[10] = "blanc";//-23
lescouleurs[11] = "Rouge foncé";//--3
lescouleurs[12] = "violet";//-23
lescouleurs[13] = "vert foncé";//--3
lescouleurs[14] = "vert clair";//--3
lescouleurs[15] = "chartreuse";//--3
lescouleurs[16] = "Marron";//-23
lescouleurs[17] = "cyan";//--3
lescouleurs[18] = "";

lescouleurs[19] = "";

lescouleurs[20] = "unrecognized color";
lescouleurs[21] = "red";
lescouleurs[22] = "blue";
lescouleurs[23] = "green";
lescouleurs[24] = "yellow";
lescouleurs[25] = "pink";
lescouleurs[26] = "black";
lescouleurs[27] = "gray";
lescouleurs[28] = "orange";
lescouleurs[29] = "purple";
lescouleurs[30] = "white";
lescouleurs[31] = "dark red";
lescouleurs[32] = "violet";
lescouleurs[33] = "dark green";
lescouleurs[34] = "light green";
lescouleurs[35] = "Charterhouse ";
lescouleurs[36] = "brown";
lescouleurs[37] = "cyan";
lescouleurs[38] = "";

lescouleurs[39] = "";

lescouleurs[40] = "unerkannte Farbe";
lescouleurs[41] = "rote";
lescouleurs[42] = "blau";
lescouleurs[43] = "grün";
lescouleurs[44] = "gelbe";
lescouleurs[45] = "rosa";
lescouleurs[46] = "schwarz";
lescouleurs[47] = "grau";
lescouleurs[48] = "orange";
lescouleurs[49] = "lila";
lescouleurs[50] = "weiss";
lescouleurs[51] = "dunkelrot";
lescouleurs[52] = "violett";
lescouleurs[53] = "dunkellgrün";
lescouleurs[54] = "hellgrün";
lescouleurs[55] = "Karthause";
lescouleurs[56] = "braun";
lescouleurs[57] = "cyan";
lescouleurs[58] = "";

lescouleurs[59] = "";

lescouleurs[60] = "el color no reconocido";
lescouleurs[61] = "rOjo";
lescouleurs[62] = "azul";
lescouleurs[63] = "verde";
lescouleurs[64] = "amarillo";
lescouleurs[65] = "rosa";
lescouleurs[66] = "negro";
lescouleurs[67] = "gris";
lescouleurs[68] = "naranja";
lescouleurs[69] = "púrpura";
lescouleurs[70] = "blanco";
lescouleurs[71] = "rojo oscuro";
lescouleurs[72] = "violeta";
lescouleurs[73] = "verde oscuro";
lescouleurs[74] = "luz verde";
lescouleurs[75] = "Karthause";
lescouleurs[76] = "marron";
lescouleurs[77] = "cian";

var leslumieres = new Array();
leslumieres[0] = "000000";
leslumieres[1] = "FF0000";//rouge
leslumieres[2] = "0000FF";//bleu clair
leslumieres[3] = "00FF00"; //"verre";
leslumieres[4] = "FFFF00";//"75FF00" //"jaune";
leslumieres[5] = "FF3F92"; //"rose";
leslumieres[6] = "000000" //"noir";
leslumieres[7] = "7F7F7F"; //"gris";
leslumieres[8] = "FFA500";  //"orange";
leslumieres[9] = "9F00FF"; //"pourpre";
leslumieres[10] = "FFFFFF"//"blanc";
leslumieres[11] = "6B0D0D"; //"bordeaux";
leslumieres[12] = "6C0277"; //"violet";
leslumieres[13] = "095228"; //"vert foncez";
leslumieres[14] = "7FDD4C"; //"vert clair";
//leslumieres[15] = "jaune";
leslumieres[15] = "7FFF00";
leslumieres[16] = "582900";//marron
leslumieres[17] = "00FFFF";
leslumieres[18] = "007FFF";


var onKarotzConnect = function(data) {
    karotz.button.addListener(buttonListener);
    karotz.ears.addListener(earsListener);
    karotz.rfid.addListener(rfidListener);
    //mlog("je parle");
	je_parle = 1;
    karotz.tts.start(deb + "si tu veux apprendre les couleurs avec moi appuie sur ma tête : ou passe une clé sous mon nez" + fin, "fr", exitFunction);
}
karotz.connectAndStart(karotz_ip, 9123, onKarotzConnect, {});