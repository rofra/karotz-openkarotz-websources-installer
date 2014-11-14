karotz.tts2 = {};
karotz.tts2.__REG = new RegExp('url="(.*?)"');
karotz.tts2.start = function(text, lang, callback){
    text += '. bla h';
    data = {KagedoSynthesis : '<KagedoSynthesis><Identification><codeAuth>10O328e5934A7</codeAuth></Identification><Result><ResultCode/><ErrorDetail/></Result><MainData><DialogList><Dialog character="'+ lang +'">' +text+ '</Dialog></DialogList></MainData></KagedoSynthesis>'};
    result = http.post("http://webservice.kagedo.fr/nsynthesis/ws/makenewsound", data);
    m = karotz.tts2.__REG.exec(result);
	log("Result : " +m[1]);
    karotz.multimedia.play(m[1], callback);
}

/*
bicool
chuchotement
darkvadoor
guy_fort
guy_grave
guy_vieux
guy_voix_basse
helium
JulieEnfant
Juliexp
Loic
mamie
matteo
nono
papanoel
Philippe
ramboo
sidoo
electra
*/