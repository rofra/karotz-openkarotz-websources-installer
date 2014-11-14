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
	if (typeof(data) !== 'undefined') {
		data = data.replace(reg, " ");
	}
    return data;
};

// Fonction qui supprime les balises HTML / XML
var suppr_balises = function(data) {
    reg=new RegExp("<.[^<>]*>", "gi" );
	if (typeof(data) !== 'undefined') {    
		data=data.replace(reg, " " );
	}
    return data;
};

// Fonction qui remplace une chaîne par une autre (expression reguliere)
var myreplace = function(data, origine, dest) {
	reg = new RegExp(origine, "gi");
	if (typeof(data) !== 'undefined') {
		data = data.replace(reg, dest);
	}
	return data;
};

// Fonction qui extrait un contenu à partir d'une expression reguliere
var myextract = function(data, regexp) {
	reg = new RegExp(regexp, "gi");
	if (typeof(data) !== 'undefined') {
		data.match(reg);
		return RegExp.$1;
	} else {
		return data;
	}
};

// Fonction qui verifie si une donnée contient une expression reguliere
var mycontains = function(data, regexp) {
	reg = new RegExp(regexp, "gi");
	if (typeof(data) !== "undefined" && data.match(reg)) {
		return true;
	} else {
		return false;
	}
};

// Fonction pour extraire les cookies d'une réponse HTTP
// et les présenter sous la forme d'un tableau nommé
var getCookies = function(header)
{
	var cookies = [];
	var reg = new RegExp("^Set-Cookie: (\\w+)=([^;]+);");
	var headers=ret.header.split("\n");
	for (i = 0 ; i < headers.length ; i++)
	{
		var m = reg.exec(headers[i]);
		if (m != null)
		{
			cookies[m[1]] = m[2];
		}
	}
	return cookies;
};

// Fonction print_r pour debug
function print_r(theObj) {    
    var win_print_r = "";   
    for(var p in theObj){  
           var _type = typeof(theObj[p]);  
           if( (_type.indexOf("array") >= 0) || (_type.indexOf("object") >= 0) ){  
                  win_print_r += "{\n";  
                  win_print_r += "["+_type+"] => \n"+p;  
                  win_print_r += "\n ";  
                  win_print_r += print_r(theObj[p]);  
                  win_print_r += "}\n";  
         } else {  
                 win_print_r += "["+p+"] => ["+theObj[p]+"]\n";  
         }  
     }  
     return win_print_r;  
}

function map(func, array) {
    var len = array.length, result = new Array(len);
    for (var i = 0; i < len; i++)
		result[i] = eval(func + "(" + array[i] + ")");
    return result;
}
