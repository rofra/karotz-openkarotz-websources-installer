karotz.connectAndStart = function(host, port, callback, data) {	
    try {
        karotz.connect(host, port); log("connected");
    	karotz.start(callback, data);
    } catch(err) { log(err); }
}

var lang = params[instanceName].lang
//var lang= "fr|de";
lang = lang.split("|")
log("lang: "+lang)
lang = lang[Math.floor(Math.random()*lang.length)]
log("lang: "+lang)
/*
for i in $@
do
  echo ""
  echo nbSound[\"$i\"]=[]\;
  for d in 0 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23
   do
    VIRG=0
    echo -n nbSound[\"$i\"][$d] = \[
    for f in 0 1 2 3 4 5 6 7 8 9 10 11 12 13 14
    do
     if [ -f $i/$d/$f.mp3 ]
     then
       if [ $VIRG -eq 1 ] ; then
         echo -n , 
       fi	
       VIRG=1
       echo -n $f
     fi
    done
    echo  ]\;
  done 
done*/

var nbSound= [];
nbSound["br"]=[];
nbSound["br"][0] = [1,2,3,4,5,6,7,8,9];
nbSound["br"][1] = [1,2,3,4,5,6];
nbSound["br"][2] = [1,2,4,5,6];
nbSound["br"][3] = [1,2,3,4,5,6,7];
nbSound["br"][4] = [1,2,3,4,5,6];
nbSound["br"][5] = [1,2,4,5,6,7];
nbSound["br"][6] = [1,2,4,5,6,7,8];
nbSound["br"][7] = [1,2,4,5,6,7,8];
nbSound["br"][8] = [1,2,4,6,7];
nbSound["br"][9] = [1,2,4,5,6];
nbSound["br"][10] = [1,2,4,6,7,8,9];
nbSound["br"][11] = [1,2,4,6,7];
nbSound["br"][12] = [1,2,4,5,6,7];
nbSound["br"][13] = [1,2,3,5,6];
nbSound["br"][14] = [1,2,3,4,5,6,7];
nbSound["br"][15] = [1,2,3,5,6,7];
nbSound["br"][16] = [1,2,3,4,5];
nbSound["br"][17] = [1,2,3,4,5,6,7,8,9];
nbSound["br"][18] = [1,2,4,5,6];
nbSound["br"][19] = [1,2,4,5,6,7];
nbSound["br"][20] = [1,2,4,5,6,7];
nbSound["br"][21] = [1,2,5,6,7];
nbSound["br"][22] = [1,2,3,4,5,6,7];
nbSound["br"][23] = [1,2,4,5,6,7];

nbSound["de"]=[];
nbSound["de"][0] = [1,2,3,4,5,6,7,8];
nbSound["de"][1] = [1,2,3,4,5,6];
nbSound["de"][2] = [1,2,3,4,5,6];
nbSound["de"][3] = [1,2,3,4,5,6,7];
nbSound["de"][4] = [1,2,3,4,5,6,7];
nbSound["de"][5] = [1,3,4,5,6,7];
nbSound["de"][6] = [1,2,3,4,5,6,7];
nbSound["de"][7] = [1,2,3,4,5,6,7];
nbSound["de"][8] = [1,2,3,4,5,6];
nbSound["de"][9] = [1,2,3,4,5,6];
nbSound["de"][10] = [1,2,3,4,5,6,7];
nbSound["de"][11] = [1,2,3,4,5,7];
nbSound["de"][12] = [1,2,3,4,5,6];
nbSound["de"][13] = [1,2,4,5,6];
nbSound["de"][14] = [1,2,3,4,5,6,7,8];
nbSound["de"][15] = [1,2,3,4,5,6,7];
nbSound["de"][16] = [1,2,3,4,5,6,7,8,9,10];
nbSound["de"][17] = [1,3,4,6,7,8];
nbSound["de"][18] = [1,2,3,4,5,6];
nbSound["de"][19] = [1,2,3,4,5,6,7];
nbSound["de"][20] = [1,2,3,4,5,6,7];
nbSound["de"][21] = [1,2,4,5,6];
nbSound["de"][22] = [1,2,3,4,5,6,7,8];
nbSound["de"][23] = [1,2,3,4,5,6,7];

nbSound["es"]=[];
nbSound["es"][0] = [1,2,3,4,6,7];
nbSound["es"][1] = [1,2,3,4,5,6,7];
nbSound["es"][2] = [1,2,3,4,5,6];
nbSound["es"][3] = [1,2,3,4,5,6,7];
nbSound["es"][4] = [1,2,3,4,5,6,7,8];
nbSound["es"][5] = [1,2,3,4,5,6,7];
nbSound["es"][6] = [1,2,3,4,5,6,7];
nbSound["es"][7] = [1,2,3,4,5,6,7];
nbSound["es"][8] = [1,2,3,4,5];
nbSound["es"][9] = [1,2,3,4,5,6];
nbSound["es"][10] = [1,2,3,4,5,6,7,8];
nbSound["es"][11] = [1,2,3,4,5,6];
nbSound["es"][12] = [1,2,3,4,5,6];
nbSound["es"][13] = [1];
nbSound["es"][14] = [1,2,3,4,5,6];
nbSound["es"][15] = [1,2,3,4,5,6];
nbSound["es"][16] = [1,2,3,4,5,6,7];
nbSound["es"][17] = [1,2,4,5,6,7,8];
nbSound["es"][18] = [1,2,4,5,6];
nbSound["es"][19] = [1,2,4,5,6,7];
nbSound["es"][20] = [1,2,4,5,6,7];
nbSound["es"][21] = [1,2,3,5,6,7];
nbSound["es"][22] = [1,2,4,5,6,7];
nbSound["es"][23] = [1,2,3,4,5,6];

nbSound["fr"]=[];
nbSound["fr"][0] = [1,2,3,4,5,6,7];
nbSound["fr"][1] = [1,2,3,4,5,6];
nbSound["fr"][2] = [1,2,3,4,5,6];
nbSound["fr"][3] = [1,2,3,4,5,7];
nbSound["fr"][4] = [1,2,3,4,5,6,7];
nbSound["fr"][5] = [1,2,3,4,5,6];
nbSound["fr"][6] = [1,2,3,4,6,7];
nbSound["fr"][7] = [1,2,3,4,5,7];
nbSound["fr"][8] = [1,2,3,4,6];
nbSound["fr"][9] = [1,2,3,4,5,6];
nbSound["fr"][10] = [1,2,3,4,5,6,7,8];
nbSound["fr"][11] = [1,2,3,4,5,6];
nbSound["fr"][12] = [1,2,3,5,6];
nbSound["fr"][13] = [1,2,3,4,5,6,7];
nbSound["fr"][14] = [1,2,3,4,5,6,7,8,9];
nbSound["fr"][15] = [1,2,3,4,5,6];
nbSound["fr"][16] = [1,2,3,4,5,6,8,9];
nbSound["fr"][17] = [1,2,3,4,5,6,7,8];
nbSound["fr"][18] = [1,2,3,4,6];
nbSound["fr"][19] = [1,2,3,4,5,6,7];
nbSound["fr"][20] = [1,2,3,4,5,6,7];
nbSound["fr"][21] = [1,2,3,4,6,7];
nbSound["fr"][22] = [1,2,3,4,5,6];
nbSound["fr"][23] = [1,2,3,4,5,6];

nbSound["it"]=[];
nbSound["it"][0] = [1,2,3,4,5,6,7,8];
nbSound["it"][1] = [1,2,3,4,5,6,7];
nbSound["it"][2] = [1,2,3,4,5];
nbSound["it"][3] = [1,2,3,4,5,6,7];
nbSound["it"][4] = [1,2,3,4,5,6,7,8];
nbSound["it"][5] = [1,2,3,4,5,6,7];
nbSound["it"][6] = [1,2,3,4,5,6,7];
nbSound["it"][7] = [1,2,3,4,5,6,7,8];
nbSound["it"][8] = [1,2,3,4,5,6];
nbSound["it"][9] = [1,2,3,4,5,6];
nbSound["it"][10] = [1,2,3,4,5,6,7,8];
nbSound["it"][11] = [1,2,3,4,5,6];
nbSound["it"][12] = [1,2,3,4,5,6];
nbSound["it"][13] = [1,2,3,4,5,6];
nbSound["it"][14] = [1,2,3,4,5,6,7,8];
nbSound["it"][15] = [1,2,3,4,5,6,7];
nbSound["it"][16] = [1,2,3,4,5,6,7,8,9];
nbSound["it"][17] = [1,2,3,4,5,6,7];
nbSound["it"][18] = [1,2,3,4,5,6];
nbSound["it"][19] = [1,2,3,4,5,6,7];
nbSound["it"][20] = [1,2,3,4,5,6,7];
nbSound["it"][21] = [1,2,3,4,5,6,7];
nbSound["it"][22] = [1,2,3,4,5,6,7,8];
nbSound["it"][23] = [1,2,3,4,5,6,7];

nbSound["ja-JP"]=[];
nbSound["ja-JP"][0] = [1,2,3,4,5,6,7,8,9];
nbSound["ja-JP"][1] = [1,2,3,4,5];
nbSound["ja-JP"][2] = [1,2,3,4,5];
nbSound["ja-JP"][3] = [1,2,3,4,5,6];
nbSound["ja-JP"][4] = [1,2,3,4,5,6];
nbSound["ja-JP"][5] = [1,2,3,4,5,6];
nbSound["ja-JP"][6] = [1,2,3,4,5,6,7];
nbSound["ja-JP"][7] = [1,2,3,4,5,6];
nbSound["ja-JP"][8] = [1,2,3,5,6,7];
nbSound["ja-JP"][9] = [1,2,3,4,5];
nbSound["ja-JP"][10] = [1,2,3,4,5];
nbSound["ja-JP"][11] = [1,2,3,4,5,6];
nbSound["ja-JP"][12] = [1,2,3,4,5];
nbSound["ja-JP"][13] = [1,2,3,4,5,6];
nbSound["ja-JP"][14] = [1,2,3,4,5,6,7];
nbSound["ja-JP"][15] = [1,2,3,4,5,6,7];
nbSound["ja-JP"][16] = [1,2,3,4,5,6,7];
nbSound["ja-JP"][17] = [1,2,3,4,5,6,7];
nbSound["ja-JP"][18] = [1,2,3,4,5];
nbSound["ja-JP"][19] = [1,2,3,4,5,6];
nbSound["ja-JP"][20] = [1,2,3,4,5,6];
nbSound["ja-JP"][21] = [1,2,3,5,6];
nbSound["ja-JP"][22] = [1,2,3,4,5,6,7];
nbSound["ja-JP"][23] = [1,2,3,4,5,6];

nbSound["uk"]=[];
nbSound["uk"][0] = [1,2,3,4,5,6,7,8,9];
nbSound["uk"][1] = [1,2,3,4,5,6,7];
nbSound["uk"][2] = [1,2,4,6,7];
nbSound["uk"][3] = [1,2,3,4,5,6];
nbSound["uk"][4] = [1,2,3,4,5,6,7];
nbSound["uk"][5] = [1,2,3,4,5,6,7];
nbSound["uk"][6] = [1,2,3,4,5,6,7];
nbSound["uk"][7] = [1,2,3,4,5,6,7];
nbSound["uk"][8] = [1,2,3,4,6,7];
nbSound["uk"][9] = [1,2,3,4,5,6];
nbSound["uk"][10] = [1,2,4,6,7,8];
nbSound["uk"][11] = [1,2,3,4,6,7];
nbSound["uk"][12] = [1,2,3,4,5,6,7];
nbSound["uk"][13] = [1,2,3,4,5,6,7];
nbSound["uk"][14] = [1,2,3,4,5,6,7];
nbSound["uk"][15] = [1,2,3,4,5,6,7];
nbSound["uk"][16] = [1,2,3,4,5];
nbSound["uk"][17] = [1,2,3,4,5,6,7,8];
nbSound["uk"][18] = [1,2,3,4,5,6];
nbSound["uk"][19] = [1,2,3,4,5,6,7];
nbSound["uk"][20] = [1,2,3,4,5,6,7];
nbSound["uk"][21] = [1,2,4,5,6,7];
nbSound["uk"][22] = [1,2,3,4,5];
nbSound["uk"][23] = [1,2,3,4,5,6];

nbSound["us"]=[];
nbSound["us"][0] = [1,2,3,4,5,6,7,8,9,10];
nbSound["us"][1] = [1,2,3,4,5,6];
nbSound["us"][2] = [1,2,3,4,5];
nbSound["us"][3] = [1,2,3,4,5,6,7];
nbSound["us"][4] = [1,2,3,4,5,6,7];
nbSound["us"][5] = [1,2,3,4,5,6,7];
nbSound["us"][6] = [1,2,3,4,5,6,7,8];
nbSound["us"][7] = [1,2,3,4,5,6,7,8];
nbSound["us"][8] = [1,2,3,5,6];
nbSound["us"][9] = [1,2,3,4,5,6];
nbSound["us"][10] = [1,2,3,4,5,6,7,8];
nbSound["us"][11] = [1,2,3,4,5];
nbSound["us"][12] = [1,2,3,4,5,6];
nbSound["us"][13] = [1,2,3,4,5,6];
nbSound["us"][14] = [1,2,3,4,5,6,7,8,9];
nbSound["us"][15] = [1,2,3,4,5,6,7];
nbSound["us"][16] = [1,2,3,4,5,6,7,8,9,10];
nbSound["us"][17] = [1,2,3,4,5,6,7,8];
nbSound["us"][18] = [1,2,3,4,5,6];
nbSound["us"][19] = [1,2,3,4,5,6,7];
nbSound["us"][20] = [1,2,3,4,5,6,7];
nbSound["us"][21] = [1,2,5,6,7];
nbSound["us"][22] = [1,2,4,5,6,7,8];
nbSound["us"][23] = [1,2,3,4,5,6,7];





var d = new Date();
var h = d.getHours();
var m = d.getMinutes();


if (m > 30) h++;

var sample = nbSound[lang][h][Math.floor(Math.random()*nbSound[lang][h].length)]

var url = "http://karotz.s3.amazonaws.com/applications/clock/"+lang+"/"+h+"/"+sample+".mp3";
var ding= "http://karotz.s3.amazonaws.com/applications/clock/fr/signature.mp3";
log(url)
log(ding)
var buttonListener = function(event) {
    if ((event=='SIMPLE') || (event=='DOUBLE')) {
		karotz.multimedia.stop(); exit();
	}
}

var finish = function(event) {
    if ((event=='CANCELLED') || (event=='TERMINATED')) {
		karotz.multimedia.stop(); exit();
	}
}

var play = function(event) {
    if (event=='TERMINATED') {
	karotz.multimedia.play(url, finish);
	}
}

var onKarotzConnect = function(data) {
	karotz.multimedia.play(ding, play);	
	karotz.button.addListener(buttonListener);
	karotz.led.fade('ffff00', 2000);
}

var data = {};

karotz.connectAndStart('localhost', 9123, onKarotzConnect, data);
