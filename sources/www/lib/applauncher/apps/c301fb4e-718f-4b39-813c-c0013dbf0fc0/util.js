karotz.connectAndStart = function(host, port, callback, data){	
    try{
        karotz.connect(host, port);
    	log("connected");
    	karotz.start(callback, data);
    }catch(err){
    	log(err);
    }
};

// Fonction qui permet de supprimer tous les retours charriot
var concatener = function(data) {
	reg=new RegExp("\n", "gi");
	data = data.replace(reg, " ");
    return data;
}

// Fonction qui supprime les balises HTML / XML
var suppr_balises = function(data) {
    reg=new RegExp("<.[^<>]*>", "gi" );
    data=data.replace(reg, " " );
    return data;
}

// Fonction qui remplace une chaîne par une autre (expression reguliere)
var myreplace = function(data, origine, dest) {
	reg = new RegExp(origine, "gi");
	data = data.replace(reg, dest);
	return data;
}

// Fonction qui extrait un contenu à partir d'une expression reguliere
var myextract = function(data, regexp) {
	reg = new RegExp(regexp, "gi");
	data.match(reg);
	return RegExp.$1;
}

// Fonction qui verifie si une donnée contient une expression reguliere
var mycontains = function(data, regexp) {
	reg = new RegExp(regexp, "gi");
	if (data.match(reg)) {
		return true;
	} else {
		return false;
	}
}

