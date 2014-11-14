karotz.connectAndStart = function(host, port, callback, data){	
    try{
        karotz.connect(host, port);
    	log("connected");
    	karotz.start(callback, data);
    }catch(err){
    	log(err);
    }
};

genStats = function () {
	var url_stats = "http://www.gpower.fr/karotz/stats/gen_stats.php?appli="+app_name+"&version="+app_version;
	url_stats = url_stats.replace(/ /g,'%20');
	var data = http.get(url_stats);
}