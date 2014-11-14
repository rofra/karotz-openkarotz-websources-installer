include("util.js");
var karotz_ip = "localhost";
var jai_entendu ;

var buttonListener = function(event) {
if (event == "DOUBLE") {
karotz.tts.stop();
exit();
} return true;
}
var exitFunction = function(event) {
if ((event == "CANCELLED") || (event == "TERMINATED")) {
exit();
} return true;
}
var mon_choix1 = function() { 
karotz.tts.start("Air france . . . . . 01 . . 48 . . 59 . . 20 . . 00", "fr",  exitFunction  ) 

}
var mon_choix2 = function() { 
karotz.tts.start("Amazon . . . . . 01 . . 61 . . 08 . . 12 . . 34 . . . ou . . . 01 . . 56 . . 60 . . 46 . . 00", "fr",  exitFunction  ) 

}
var mon_choix3 = function() {
karotz.tts.start("Assaidic . . . . . 01 . . 41 . . 86 . . 24 . . 83", "fr",  exitFunction  ) 

}
var mon_choix4 = function() {
karotz.tts.start("Assurance en ligne G M F . . . . . 02 . . 38 . . 72 . . 33 . . 03", "fr",  exitFunction  ) 

}
var mon_choix5 = function() {
karotz.tts.start("Ochan Mobile . . . . . 01 . . 76 . . 61 . . 55 . . 22", "fr",  exitFunction  ) 

}
var mon_choix6 = function() {
karotz.tts.start("Axa Banque . . . . . 01 . . 49 . . 68 . . 15 . . 72 . . . ou . . . 01 . . 49 . . 68 . . 15 . . 98", "fr",  exitFunction  ) 

}
var mon_choix7 = function() {
karotz.tts.start("B . N . P . service client . . . . . 01 . . 49 . . 46 . . 62 . . 54", "fr",  exitFunction  ) 

}
var mon_choix8 = function() {
karotz.tts.start("Bouygue tailaicom service client . . . . . 01 . . 41 . . 90 . . 88 . . 91 . . . ou pour les entreprises . . . 01 . . 41 . . 90 . . 87 . . 01", "fr",  exitFunction  ) 

}
var mon_choix9 = function() {
karotz.tts.start("Kafe . . . . . Attention les deux derniers chiffres sont a remplacai par le numairo de votre daipartement . . . . . 04 . .72 . . 35 . . 62 . . 00", "fr",  exitFunction  ) 

}
var mon_choix10 = function() {
karotz.tts.start("caisse daipargne . . . . . 01 . . 43 . . 22 . . 69 . . 09", "fr",  exitFunction  ) 

}
var mon_choix11 = function() {
karotz.tts.start("canal plusse . . . . . 01 . . 71 . . 35 . . 35 . . 35 . . . demandai le service clien", "fr",  exitFunction  ) 

}
var mon_choix12 = function() {
karotz.tts.start("canal sate . . . . . 01 . . 71 . . 35 . . 35 . . 35 . . . demandai le service clien", "fr",  exitFunction  ) 

}
var mon_choix13 = function() {
karotz.tts.start("karefour service aprai vente . . . . . 01 . . 69 . . 11 . . 39 . . 45 . . et . . . karefour service client . . . . . 01 . . 41 . . 86 . . 24 . . 47", "fr",  exitFunction  ) 

}
var mon_choix14 = function() {
karotz.tts.start("c . discount . . . . Attention numairo payant . . . . 39 . . 79", "fr",  exitFunction  ) 

}
var mon_choix15 = function() {
karotz.tts.start("c . g . tail . . . . . 01 . . 41 . . 86 . . 26 . . 13", "fr",  exitFunction  ) 

}
var mon_choix16 = function() {
karotz.tts.start("c . t . laim . . . . . 01 . . 57 . . 05 . . 03 . . 78 . . . ou . . . 04 . . 96 . . 11 . . 86 . . 74", "fr",  exitFunction  ) 

}
var mon_choix17 = function() {
karotz.tts.start("cofidisse . . . . . 03 . . 28 . . 77 . . 64 . . 72", "fr",  exitFunction  ) 

}
var mon_choix18 = function() {
karotz.tts.start("daile service client . . . . . 04 . . 99 . . 75 . . 40 . . 08", "fr",  exitFunction  ) 

}
var mon_choix19 = function() {
karotz.tts.start("direct assurance . . . . . 01 . . 46 . . 14 . . 44 . . 14 . . . ou . . . 01 . . 46 . . 14 . . 44 . . 00", "fr",  exitFunction  ) 

}
var mon_choix20 = function() {
karotz.tts.start("disnailand . . . . . 01 . . 60 . . 30 . . 60 . . 51", "fr",  exitFunction  ) 

}
var mon_choix21 = function() {
karotz.tts.start("E . D . F . . . . . 01 . . 57 . . 05 . . 04 . . 83", "fr",  exitFunction  ) 

}
var mon_choix22 = function() {
karotz.tts.start("Europe kar . . . . . 01 . . 55 . . 66 . . 83 . . 00", "fr",  exitFunction  ) 

}
var mon_choix23 = function() {
karotz.tts.start("France tailaicom . . . . . Attention ce nai pa le numairo dOrange . . . . . 01 . . 44 . . 44 . . 22 . . 22", "fr",  exitFunction  ) 

}
var mon_choix24 = function() {
karotz.tts.start("Fri i . . . . . 01 . . 42 . . 66 . . 90 . . 03 . . . ou . . . 01 . . 42 . . 66 . . 90 . . 04", "fr",  exitFunction  ) 

}
var mon_choix25 = function() {
karotz.tts.start("G . D . F . . . . . 01 . . 41 . . 86 . . 42 . . 50 . . ou . . 01 . . 41 . . 86 . . 42 . . 51 . . ou . . 01 . . 41 . . 86 . . 42 . . 00 . . . et pour les professionnels . . . . 01 . . 41 . . 86 . . 42 . . 50", "fr",  exitFunction  ) 

}
var mon_choix26 = function() {
karotz.tts.start("groupama . . . . . 01 . . 57 . . 05 . . 04 . . 42 . . . ou . . . 01 . . 57 . . 05 . . 04 . . 45 . . . ou . . . 01 . . 57 . . 05 . . 04 . . 69", "fr",  exitFunction  ) 

}
var mon_choix27 = function() {
karotz.tts.start("airtz service client . . . . . 01 . . 39 . . 38 . . 38 . . 38", "fr",  exitFunction  ) 

}
var mon_choix28 = function() {
karotz.tts.start("H . P . . .  Attention numairo masquai obligatoire . . .  01 . . 41 . . 86 . . 24 . . 05", "fr",  exitFunction  ) 

}
var mon_choix29 = function() {
karotz.tts.start("I . kai . a . . . . 03 . . 88 . . 27 . . 57 . . 56", "fr",  exitFunction  ) 

}
var mon_choix30 = function() {
karotz.tts.start("La banque postale . . . . Attention numairo masquai obligatoire . . . . . 01 . . 45 . . 45 . . 36 . . 39 . . ou . . 01 57 05 04 23", "fr",  exitFunction  ) 

}
var mon_choix31 = function() {
karotz.tts.start("La maison de valairie . . . . . 02 . . 54 . . 81 . . 50 . . 50 . . . ou . . . 02 . . 54 . . 42 . . 75 . . 10", "fr",  exitFunction  ) 

}
var mon_choix32 = function() {
karotz.tts.start("La poste . . . . . 01 . . 54 . . 44 . . 02 . . 13 . . . . et le service client et raiclamation . . . . . 03 . . 26 . . 68 . . 72 . . 05", "fr",  exitFunction  ) 

}
var mon_choix33 = function() {
karotz.tts.start("La redoute . . . . . 03 . . 20 . . 69 . . 60 . . 00", "fr",  exitFunction  ) 

}
var mon_choix34 = function() {
karotz.tts.start("Les troi suisse . . . . . 03 . . 20 . . 20 . . 30 . . 30", "fr",  exitFunction  ) 

}
var mon_choix35 = function() {
karotz.tts.start("L . C . L . . . . . Attention numairo masquai obligatoire . . . . 01 . . 48 . . 82 . . 47 . . 42", "fr",  exitFunction  ) 

}
var mon_choix36 = function() {
karotz.tts.start("aime . six . boutique . . . . . 01 . . 41 . . 86 . . 42 . . 48 . . ou . . 01 . . 41 . . 86 . . 30 . . 08 . . ou . . 01 . . 41 . . 86 . . 24 . . 25", "fr",  exitFunction  ) 

}
var mon_choix37 = function() {
karotz.tts.start("Massife . . . . . 05 . . 49 . . 09 . . 42 . . 42", "fr",  exitFunction  ) 

}
var mon_choix38 = function() {
karotz.tts.start("Mati . . . . . 03 . . 81 . . 48 . . 49 . . 18", "fr",  exitFunction  ) 

}
var mon_choix39 = function() {
karotz.tts.start("Mister . goud . dil . . . . . 01 . . 69 . . 19 . . 84 . . 61", "fr",  exitFunction  ) 

}
var mon_choix40 = function() {
karotz.tts.start("mono pri . . . . . 01 . . 57 . . 05 . . 04 . . 44", "fr",  exitFunction  ) 

}
var mon_choix41 = function() {
karotz.tts.start("motorola . . . . . 01 . . 55 . . 69 . . 50 . . 43", "fr",  exitFunction  ) 

}
var mon_choix42 = function() {
karotz.tts.start("numairicable . . . . . 01 . . 77 . . 46 . . 80 . . 00 . . . ou . . . 01 77 46 99 99", "fr",  exitFunction  ) 

}
var mon_choix43 = function() {
karotz.tts.start("nokia . . . . 01 . . 49 . . 15 . . . 15 . . 15", "fr",  exitFunction  ) 

}
var mon_choix44 = function() {
karotz.tts.start("n . r . j group . . . . . 01 . . 40 . . 71 . . 40 . . 00 . . . . . n . r . j radio . . . 01 . . 57 . . 05 . . 04 . . 74 . . ou . . 01 . . 57 . . 05 . . 04 . . 75", "fr",  exitFunction  ) 

}
var mon_choix45 = function() {
karotz.tts.start("olimpus . . . . . 01 . . 45 . . 60 . . 23 . . 00", "fr",  exitFunction  ) 

}
var mon_choix46 = function() {
karotz.tts.start("orange service client internet . . . . . 01 . . 30 . . 07 . . 20 . . 00 . . . service technique internet . . . . . 01 . . 41 . . 83 . . 95 . . 13 . . . service client mobile . . . . . 01 . . 56 . . 95 . . 69 . . 44 . . ou . . 700", "fr",  exitFunction  ) 

}
var mon_choix47 = function() {
karotz.tts.start("R . A . T . P  . . . . . 01 . . 43 . . 46 . . 14 . . 14", "fr",  exitFunction  ) 

}
var mon_choix48 = function() {
karotz.tts.start("ru du comairce . . . . . 01 . . 72 . . 93 . . 12 . . 90", "fr",  exitFunction  ) 

}
var mon_choix49 = function() {
karotz.tts.start("sofinco . . . . . 01 . . 49 . . 72 . . 79 . . 00", "fr",  exitFunction  ) 

}
var mon_choix50 = function() {
karotz.tts.start("sur coufe . . . . . 01 . . 53 . . 33 . . 21 . . 18", "fr",  exitFunction  ) 

}
var mon_choix51 = function() {
karotz.tts.start("T . F  . 1 . . . . . 01 . . 41 . . 41 . . 12 . . 34 . . . et pour les jeu . . . . 01 . . 41 . . 86 . . 30 . . 12 . . ou . . 01 . . 41 . . 86 . . 30 . . 13", "fr",  exitFunction  ) 

}
var mon_choix52 = function() {
karotz.tts.start("Totale carte clube . . . . . 01 . . 39 . . 34 . . 56 . . 78", "fr",  exitFunction  ) 

}
var mon_choix53 = function() {
karotz.tts.start("T . P . S . . . . . 03 . . 81 . . 67 . . 23 . . 12 . . . . et service abonemen . . . . . 01 . . 46 . . 73 . . 20 . . 85", "fr",  exitFunction  ) 

}
var mon_choix54 = function() {
karotz.tts.start("ver bo dai . . . . . 03 . . 20 . . 76 . . 92 . . 70 . . ou . . 03 . . 20 . . 23 . . 35 . . 00", "fr",  exitFunction  ) 

}
var mon_choix55 = function() {
karotz.tts.start("x . box . . service aprai vente . . . . . 01 . . 55 . . 69 . . 80 . . 61", "fr",  exitFunction  ) 

}
var mon_choix56 = function() {
karotz.tts.start("fnac . . . . . 01 . . 53 . . 56 . . 28 . . 00", "fr",  exitFunction  )

}
var mon_choix57 = function() {
karotz.tts.start("samsung . . . . . 01 . . 55 . . 68 . . 40 . . 00", "fr",  exitFunction  ) 

}
var mon_choix58 = function() {
karotz.tts.start("axa assurance . . . . . 01 . . 41 . . 86 . . 92 . . 56", "fr",  exitFunction  ) 

}
var mon_choix59 = function() {
karotz.tts.start("ochan service client . . . . . 03 . . 20 . . 67 . . 57 . . 69", "fr",  exitFunction  ) 

}
var mon_choix60 = function() {
karotz.tts.start("Darti . . . . . 01 . . 46 . . 84 . . 10 . . 29", "fr",  exitFunction  ) 

}
var mon_choix61 = function() {
karotz.tts.start("Epson . . . . . 01 . . 41 . . 86 . . 24 . . 97", "fr",  exitFunction  ) 

}
var mon_choix62 = function() {
karotz.tts.start("page jaune . . . . . 01 . . 46 . . 23 . . 30 . . 00", "fr",  exitFunction  ) 

}
var mon_choix63 = function() {
karotz.tts.start("pakar bai le . . . . . 01 . . 55 . . 23 . . 72 . . 00", "fr",  exitFunction  ) 

}
var mon_choix64 = function() {
karotz.tts.start("conforama . . . Service aprai vente . . . . . 03 . . 85 . . 67 . . 99 . . 30", "fr",  exitFunction  ) 

}
var mon_choix65 = function() {
karotz.tts.start("boulanger . . . . Service aprai vente . . et si pas identifiai . . serice client . . . . . 03 . . 20 . . 49 . . 47 . . 73", "fr",  exitFunction  ) 


}


var service_demande = function() {
karotz.tts.start("cet a toi...", "fr", function(event) {
if ((event == "CANCELLED") || (event == "TERMINATED")) {
karotz.asr.string("air france | amazon | assaidic | jai aimaife | ochan mobile | axa banque | bai aine pai | bouygue tailaicome | kafe | caisse daipargne | canal plusse | canal sate | karefour | cezdiscount | caigaitaile | caitailaime | cofidis | daile | direct assurance | disnailand | eu dai aif | europe kar | fnac | france tailaicom | fri | jaidai aife | groupama | airtz | hache pai | Ikez a | la banque postale | la maison de valairie | la poste | la redoute | les trois suisse | aile cez aile | aime six boutique | Massife | mati | mister goud dil | Mono pri | motorola | numairicable | nokia | aine aire ji | Olimpus | orange | aire ah tez pai | ru du comairce | samsung | scot laisse | esse aine cez aife | sociaitai gainairale | sofinco | sur coufe | tai aife un | Totale | tai pai aisse | Verbodai | ixeboxe | Samsung | axa assurance | ochan service client | Darti | Epsone | Page jaune | Pakarbaile | Conforama | Boulanger", "fr-FR", function(asrResult) {
jai_entendu = asrResult.text;
log(asrResult.text);
if (jai_entendu == "<nomatch>")
setTimeout(6000, function() { service_demande() });

else
if (jai_entendu == "air france"){mon_choix1();}
else if (jai_entendu == "amazon"){mon_choix2();}
else if (jai_entendu == "assaidic"){mon_choix3();}
else if (jai_entendu == "jai aime aife"){mon_choix4();}
else if (jai_entendu == "ochan mobile"){mon_choix5();}
else if (jai_entendu == "axa banque"){mon_choix6();}
else if (jai_entendu == "bai aine pai"){mon_choix7();}
else if (jai_entendu == "bouygue tailaicom"){mon_choix8();}
else if (jai_entendu == "kafe"){mon_choix9();}
else if (jai_entendu == "caisse daipargne"){mon_choix10();}
else if (jai_entendu == "canal plusse"){mon_choix11();}
else if (jai_entendu == "canal sate"){mon_choix12();}
else if (jai_entendu == "karefour"){mon_choix13();}
else if (jai_entendu == "cezdiscount"){mon_choix14();}
else if (jai_entendu == "caigaitaile"){mon_choix15();}
else if (jai_entendu == "caitailaime"){mon_choix16();}
else if (jai_entendu == "cofidis"){mon_choix17();}
else if (jai_entendu == "daile"){mon_choix18();}
else if (jai_entendu == "direct assurance"){mon_choix19();}
else if (jai_entendu == "disnailand"){mon_choix20();}
else if (jai_entendu == "eu dai aif"){mon_choix21();}
else if (jai_entendu == "europe kar"){mon_choix22();}
else if (jai_entendu == "france tailaicom"){mon_choix23();}
else if (jai_entendu == "fri"){mon_choix24();}
else if (jai_entendu == "jai dai aife"){mon_choix25();}
else if (jai_entendu == "Groupama"){mon_choix26();}
else if (jai_entendu == "airtz"){mon_choix27();}
else if (jai_entendu == "hache pai"){mon_choix28();}
else if (jai_entendu == "Ikez a"){mon_choix29();}
else if (jai_entendu == "La banque postale"){mon_choix30();}
else if (jai_entendu == "la maison de valairie"){mon_choix31();}
else if (jai_entendu == "la poste"){mon_choix32();}
else if (jai_entendu == "la redoute"){mon_choix33();}
else if (jai_entendu == "les trois suisse"){mon_choix34();}
else if (jai_entendu == "aile cez aile"){mon_choix35();}
else if (jai_entendu == "aime six boutique"){mon_choix36();}
else if (jai_entendu == "Massife"){mon_choix37();}
else if (jai_entendu == "Mati"){mon_choix38();}
else if (jai_entendu == "Mister goud dil"){mon_choix39();}
else if (jai_entendu == "mono pri"){mon_choix40();}
else if (jai_entendu == "motorola"){mon_choix41();}
else if (jai_entendu == "numairicable"){mon_choix42();}
else if (jai_entendu == "nokia"){mon_choix43();}
else if (jai_entendu == "aine aire ji"){mon_choix44();}
else if (jai_entendu == "Olimpus"){mon_choix45();}
else if (jai_entendu == "Orange"){mon_choix46();}
else if (jai_entendu == "aire ah tez pai"){mon_choix47();}
else if (jai_entendu == "ru du comerce"){mon_choix48();}
else if (jai_entendu == "sofinco"){mon_choix49();}
else if (jai_entendu == "sur coufe"){mon_choix50();}
else if (jai_entendu == "tai aife un"){mon_choix51();}
else if (jai_entendu == "Totale"){mon_choix52();}
else if (jai_entendu == "tai pai aisse"){mon_choix53();}
else if (jai_entendu == "Verbodai"){mon_choix54();}
else if (jai_entendu == "ixeboxe"){mon_choix55();}
else if (jai_entendu == "Fnac"){mon_choix56();}
else if (jai_entendu == "Samsung"){mon_choix57();}
else if (jai_entendu == "axa assurance"){mon_choix58();}
else if (jai_entendu == "ochan service clien"){mon_choix59();}
else if (jai_entendu == "Darti"){mon_choix60();}
else if (jai_entendu == "epsone"){mon_choix61();}
else if (jai_entendu == "page jaune"){mon_choix62();}
else if (jai_entendu == "pakarbaile"){mon_choix63();}
else if (jai_entendu == "conforama"){mon_choix64();}
else if (jai_entendu == "Boulanger"){mon_choix55();}
else { service_demande() ;}
}); } });
}
var onKarotzConnect = function(data) {
karotz.button.addListener(buttonListener);
karotz.tts.start("Bonjour,  . . .  les numairos comuniquer son tousse gratui depui une ligne internet . . . . ai ils son dai con tai de votre forfai depui un mobile . . . . . . .                                                    Prononcer en articulan bien le nom de l'entreprise", "fr",function (event) {

if ((event == "CANCELLED") || (event == "TERMINATED")) { service_demande() }
});
}
karotz.connectAndStart(karotz_ip, 9123, onKarotzConnect, {});