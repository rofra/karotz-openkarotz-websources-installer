include("util.js");
include("tts2.js");

//var karotz_ip="192.168.1.199";
var karotz_ip="localhost";


var bout1 = new Array();
var mon_bout1 = Math.floor(Math.random() *18);
bout1[0]="Avec ";
bout1[1]="Considérant ";
bout1[2]="Où que nous mène ";
bout1[3]="Eu égard à ";
bout1[4]="Vu ";
bout1[5]="En ce qui concerne ";
bout1[6]="Dans le cas particulier de ";
bout1[7]="Quelle que soit ";
bout1[8]="Du fait de ";
bout1[9]="Tant que durera ";
bout1[10]="Quoi qu'on dise concernant ";
bout1[11]="Nonobstant ";
bout1[12]="Compte tenu de ";
bout1[13]="Malgré ";
bout1[14]="Pour réagir face à ";
bout1[15]="Afin de circonvenir à ";
bout1[16]="Dans le but de pallier à ";
bout1[17]="Si vous voulez mon avis concernant ";
 
var bout2 = new Array();
var mon_bout2 = Math.floor(Math.random() *18);        
bout2[0]="la restriction ";
bout2[1]="l'orientation ";
bout2[2]="la crise ";
bout2[3]="l'inerssie ";
bout2[4]="la difficulté ";
bout2[5]="l'austérité ";
bout2[6]="la dégradation ";
bout2[7]="cette rigueur ";
bout2[8]="la dualité de la situation ";
bout2[9]="la baisse de confiance ";
bout2[10]="la morosité ";
bout2[11]="la situation ";
bout2[12]="l'ambiance ";
bout2[13]="la politique ";
bout2[14]="la fragilité ";
bout2[15]="complexité ";
bout2[16]="l'inconstance ";
bout2[17]="cette inflexion ";

var bout3 = new Array();  
var mon_bout3 = Math.floor(Math.random() *11);
bout3[0]="présente ";
bout3[1]="actuelle ";
bout3[2]="générale ";
bout3[3]="induite ";
bout3[4]="conjoncturelle ";
bout3[5]="observée ";
bout3[6]="contextuelle ";
bout3[7]="de ces derniers temps ";
bout3[8]="de l'époque actuelle ";
bout3[9]="intrinsèque ";
bout3[10]="que nous constatons ";

var bout4 = new Array(); 
var mon_bout4 = Math.floor(Math.random() *18);
bout4[0]="il convient d#";
bout4[1]="il faut";
bout4[2]="on se doit d#";
bout4[3]="il est préférable d#";
bout4[4]="il serait intéressant d#";
bout4[5]="il ne faut pas négliger d#";
bout4[6]="on ne peut se passer d#";
bout4[7]="il est nécessaire d#";
bout4[8]="il serait bon d#";
bout4[9]="il faut de toute urgence";
bout4[10]="je recommande d#";
bout4[11]="je préconise un audit afin d#";
bout4[12]="il est très important d#";
bout4[13]="il ne faut pas s'interdire d#";
bout4[14]="nous sommes contraints d#";
bout4[15]="je suggère fortement d#";
bout4[16]="je n'exclus pas d#";
bout4[17]="je vous demande d#";

var bout5 = new Array();  
var mon_bout5 = Math.floor(Math.random() *25);       
bout5[0]="étudier ";
bout5[1]="examiner ";
bout5[2]="favoriser ";
bout5[3]="prendre en considération ";
bout5[4]="anticiper ";
bout5[5]="imaginer ";
bout5[6]="uniformiser ";
bout5[7]="remodeler ";
bout5[8]="avoir à l'esprit ";
bout5[9]="se remémorer ";
bout5[10]="gérer ";
bout5[11]="fédérer ";
bout5[12]="comprendre ";
bout5[13]="analyser ";
bout5[14]="appréhender ";
bout5[15]="expérimenter ";
bout5[16]="essayer ";
bout5[17]="caractériser ";
bout5[18]="façonner ";
bout5[19]="revoir ";
bout5[20]="prendre en compte ";
bout5[21]="arrêter de stigmatiser ";
bout5[22]="considérer ";
bout5[23]="réorganiser ";
bout5[24]="inventorier ";

var bout6 = new Array();
var mon_bout6 = Math.floor(Math.random() *14); 
bout6[0]="toutes les ";
bout6[1]="chacune des ";
bout6[2]="la majorité des ";
bout6[3]="la simultanéité des ";
bout6[4]="l'ensemble des ";
bout6[5]="la somme des ";
bout6[6]="la totalité des ";
bout6[7]="la globalité des ";
bout6[8]="les relations des ";
bout6[9]="certaines ";
bout6[10]="la plus grande partie des ";
bout6[11]="les principales ";
bout6[12]="systématiquement les ";
bout6[13]="précisément les ";

var bout7 = new Array(); 
var mon_bout7 = Math.floor(Math.random() *15);
bout7[0]="solutions ";
bout7[1]="issues ";
bout7[2]="problématiques ";
bout7[3]="voies ";
bout7[4]="alternatives ";
bout7[5]="organisations matricielles ";
bout7[6]="améliorations ";
bout7[7]="ouvertures ";
bout7[8]="synergies ";
bout7[9]="actions ";
bout7[10]="options ";
bout7[11]="décisions ";
bout7[12]="modalités ";
bout7[13]="hypothèses ";
bout7[14]="stratégies ";

var bout8 = new Array();
var mon_bout8 = Math.floor(Math.random() *15); 
bout8[0]="imaginables ";
bout8[1]="possibles ";
bout8[2]="s'offrant à nous ";
bout8[3]="de bon sens ";
bout8[4]="envisageables ";
bout8[5]="éventuelles ";
bout8[6]="réalisables ";
bout8[7]="déclinables ";
bout8[8]="pertinentes ";
bout8[9]="que nous connaissons ";
bout8[10]="évidentes ";
bout8[11]="optimales ";
bout8[12]="opportunes ";
bout8[13]="emblématiques ";
bout8[14]="draconiennes ";

var bout9 = new Array();
var mon_bout9 = Math.floor(Math.random() *24); 
bout9[0]="à long terme";
bout9[1]="pour longtemps";
bout9[2]="à l'avenir";
bout9[3]="pour le futur";
bout9[4]="depuis longtemps";
bout9[5]="à court terme";
bout9[6]="rapidement";
bout9[7]="dans une perspective correcte";
bout9[8]="avec toute la prudence requise";
bout9[9]="de toute urgence";
bout9[10]="même si ce n'est pas facile";
bout9[11]="même si nous devons en tirer des conséquences";
bout9[12]="très attentivement";
bout9[13]="avec beaucoup de recul";
bout9[14]="parce que la nature a horreur du vide";
bout9[15]="parce que nous ne faisons plus le même métier";
bout9[16]="toutes choses étant égales par ailleurs";
bout9[17]="et déjà en notre possession";
bout9[18]="en prenant toutes les précautions qui s'imposent";
bout9[19]="si l'on veut s'en sortir un jour";
bout9[20]="parce qu'il est temps d'agir";
bout9[21]="parce qu'il s'agit de notre dernière chance";
bout9[22]="parce que les mêmes causes produisent les mêmes effets";
bout9[23]="parce que nous le valons bien";

var bout10 = new Array();
var mon_bout10 = Math.floor(Math.random() *29); 
bout10[0]="A bon entendeur...";
bout10[1]="A bon entendeur... Salut";
bout10[2]="Si tu t'en fous dskejdi, taka mle dire, ça ira plus vite";
bout10[3]="Et même sijpasse pour le vieux con de service, ce n'est pas très grave, j'ai l'habitude";
bout10[4]="Et crois-moi, je ne suis pas si bête que ça";
bout10[5]="Et Si çatpose un problème, fais comme si je n'étais pas là";
bout10[6]="Et un peu de respect pour ton vieux père... Oui, désolé de te l'apprendre aussi crument mais je suis ton père";
bout10[7]="Dis, tu mapalèr bien frais... T'aurais pas pris des substances illicites par hasard?";
bout10[8]="Mé après tout... Chépa pourquoi jte dis ça, chui sur kté même pas capable d'en comprendre la moitié";
bout10[9]="Au faite, tu nle savais pttett pas mais Dieu ordonna a Hélène de s'égarer... et Hélène Ségara !";
bout10[10]="Petite confidence entre toi et moi... J'attends une véritable occasion d'offrir des fleurs à ma femme. A son enterrement peut-être...";
bout10[11]="Allez, Je vais te dire quelque chose d'important que tu dois savoir... Le mariage est comme un mirage dans le désert : cocotiers, sable fin, oasis... Soudain, tout disparaît et il ne reste plukeu le chameau";
bout10[12]="Et puis cépatouça mais jme dmande bien si l'invention du suppositoire restera dans les annales";
bout10[13]="Attention attention! Magnifikbute pour l'équipe de france! Non je déconne...";
bout10[14]="Et puis avec ça il y a des jours où je suis loin d'être parfait. En effet, il m'arrive de te ressembler";
bout10[15]="Il y a des fois où je me sens intouchable. Je rote, je pète, rien ne m'arrête...";
bout10[16]="Pendant qu'onyè,hier je suis allé à la pharmacie pour demander du viagra. Le pharmacien me demande si j'avais une ordonnance... Je lui ai répondu que non, puis j'ai sorti la photo de ma fame... Il est parti en chercher en courant";
bout10[17]="Ce matin, en me levant, je me suis posé cette question : Eskune prostituée qui tombe enceinte peut être considéré comme un accident de travail ?";
bout10[18]="Attention, note bien dans un cahier ce que je vais te dire, ça ne se reproduira pas si souvent. Si un grain de sable pouvait te faire comprendre à quel point je t'aime, alors je t'offrirai le Sahara...";
bout10[19]="Hier soir au bal muzette, ya une espèce de vieille bikette qui me demande la chose suivante : on va chez toi ou chez moi? Je lui répond: Et pourquoi pas toi chez toi et moi chez moi?";
bout10[20]="Il est également à noter que l'avancée de la science à permis de concevoir un enfant dans une éprouvette, alors qu'avant, on pouvait en avoir plusieurs avec la même cruche.";
bout10[21]="Et si parfois tu te sens un peu démoralisé ou dépressif, rappelle-toi que tu as été un jour le spermatozoïde le plus rapide du troupeau...";
bout10[22]="Au faite, tu connais l'histoire de Zaia? Nan? Alors c'est Zaia qui court, qui court et PAF elle tombe, et elle se fai un bleu !";
bout10[23]="en plus de ça, je suis allé à lourdes avec ma femme la semaine dernière. Il n'y a pas eu de miracles, je suis revenu avec";
bout10[24]="Et puiske tu veux tout savoir, la réussite, pour un homme, c'est d'être parvenu a gagner plus d'argent que sa femme n'a pu en dépenser.";
bout10[25]="Et même siskejdi est faux, ne me poursuis pas en justice pour autant. De toute manière, je ne parlerai qu'en présence de ma vodka";
bout10[26]="d'ailleurs, jmedmande si DSK va pa être engagé comme vigile,  au FMI. o moins Comme ça, il pourra monter LAGARDE !";
bout10[27]="Et après une grande analyse de ma part, j'ai découvert la différence entre le rêve américain et le rêve français. Le rêve américain c : iès oui cane, Le rêve français c : iès, ouikènde !!";
bout10[28]="A ce propos, ça t'arrives de faires des mauvais rêves? J'en ai fait un tout à l'heure pendant ma sieste... J'étais en train de faire saute-mouton avec une licorne";


chaine ='' ;
chaine1 = bout1[mon_bout1] ;
chaine2 = bout2[mon_bout2] ;
chaine3 = bout3[mon_bout3] ;
chaine4 = bout4[mon_bout4] ;
chaine5 = bout5[mon_bout5] ;
chaine6 = bout6[mon_bout6] ;
chaine7 = bout7[mon_bout7] ;
chaine8 = bout8[mon_bout8] ;
chaine9 = bout9[mon_bout9] ;
chaine10 = bout10[mon_bout10] ;



if (chaine4.charAt(chaine4.length-1) == '#')
{
chaine4 = chaine4.substring(0, chaine4.length-1) ;
aux = 'aeiouyhéè' ;
boule = false ;
for (j = 0 ; j<aux.length ; j++)
	{if (chaine5.charAt(0) == aux.charAt(j)) {boule = true} ;} ;
if (boule)  {liaison = "'"} else {liaison = "e "} ;
}
else
liaison =' ' ;	

chaine = chaine1 + ' ' + chaine2 + ' ' + chaine3 + ', ' + chaine4 + liaison + chaine5 + ' ' + chaine6 + ' ' + chaine7 + ' ' + chaine8 + ', ' + chaine9;


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

var nerienfaire = function(event) {
    
    return true;
}


var change_phrase = function(event) {
    if((event == "CANCELLED") || (event == "TERMINATED")) {
               //log (chaine);
               karotz.led.fade("FFA500", 5000,nerienfaire);
               karotz.tts.start(chaine10, "guy_vieux", exitFunction);
               //karotz.tts.start(bout10[28], "guy_vieux", exitFunction);
    }
    return true;
}


var etape2 = function(event) {
    if((event == "CANCELLED") || (event == "TERMINATED"))
        
        karotz.tts.start(chaine, "guy_vieux", change_phrase);
}


var onKarotzConnect = function(data) {
    karotz.button.addListener(buttonListener);
    
    karotz.led.light("75FF00");
    karotz.tts.start("<voice emotion ='happy'><prosody rate = '-25%'>Lucien l'ancien!/<prosody>", "fr", etape2);

    
    
    
}

karotz.connectAndStart(karotz_ip, 9123, onKarotzConnect, {});
