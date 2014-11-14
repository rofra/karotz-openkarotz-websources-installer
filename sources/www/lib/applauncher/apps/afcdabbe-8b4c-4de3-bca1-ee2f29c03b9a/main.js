include("util.js");

var karotz_ip="localhost";
var parmi = 0;
var sss = "";
var Record = 0;
var tentatives = 0;

var buttonListener = function(event) 
{
    if (event == "DOUBLE") 
	{
        karotz.tts.stop();
        exit();
    }
    return true;
}

var buttonListener2 = function(event)
{
	if (event == "SIMPLE")
	{
		karotz.tts.stop();
		exit();
	}
}

var exitFunction = function(event) 
{
    if((event == "CANCELLED") || (event == "TERMINATED")) 
	{
        exit();
    }
    return true;
}

var PileOuFace = function() 
{
	karotz.led.light("66FFFF");
	karotz.multimedia.play("http://joe.chartouny.free.fr/Karotzdev/audio/Coin.mp3", 
	function(event)
	{
		if (event=="CANCELLED" || event=="TERMINATED")
		{
			var randomnumber=Math.floor(Math.random()*4);
			var result="";
			
			switch(randomnumber)
			{
				case 0:
				  result="face!";
				  break;
				case 1:
				  result="face, mon cher horace!";
				  break;
				case 2:
				  result="pile!";
				  break;
				case 3:
				  result="pile, mon cher émile!";
				  break;
				default:
				  result="je ne sais pas";
				  break;
			}
			karotz.tts.start(result, "fr", exitFunction);
		}
	});
}

var choixdechiffres = function(asrResult)
{
	if (asrResult.semantic == "No result before the no-input timeout")
	{
		karotz.led.light("FF0000");
		if (tentatives<3)
		{
			tentatives++;
			karotz.tts.start("Je n'ai rien entendu, répète s'il te plaît.","fr",
			function(event)
			{
				if (event=="TERMINATED" || event=="CANCELLED")
				{
					karotz.asr.string("1|2|3|4|5|6|7|8|9|10","fr",choixdechiffres);
				}
			});
		}
		else
		{
			karotz.tts.start("Bon baya personne...","fr",exitFunction);
		}
	}
	else
	{
		tentatives=0;
		if (asrResult.text == "<nomatch>")
		{
			karotz.led.light("FF0000");
			karotz.tts.start("Je suis désolé, je n'ai pas compris. Répète ton nombre, s'il te plait.","fr",
			function(event)
			{
				if (event=="TERMINATED" || event=="CANCELLED")
				{
					karotz.asr.string("1|2|3|4|5|6|7|8|9|10","fr",choixdechiffres);
				}
			});
		}
		else
		{
			karotz.led.light("66FFFF");
			var k = parseInt(asrResult.text);
			var ss = "";
			if (k==1)
			{
				ss = "Voici le nombre que j'ai choisi pour toi: ";
			}
			else
			{
				ss = "Voici les "+asrResult.text+" nombres que j'ai choisis pour toi: ";
			}
			var mot = ", puis";
			for (var l=0; l<k; l++)
			{
				switch (l)
				{
					case k-2:
						mot=", et enfin, ";
						break;
					case k-1:
						mot=". Et voila.";
						break;
					default:
						mot=", puis ";
						break;
				}
				ss += (Math.floor(Math.random()*parmi+1)).toString()+mot;
			}
			karotz.tts.start(ss,"fr",exitFunction);
		}
	}
}
var choixdechiffres2 = function(asrResult)
{
	if (asrResult.semantic == "No result before the no-input timeout")
	{
		karotz.led.light("FF0000");
		if (tentatives<3)
		{
			tentatives++;
			karotz.tts.start("Je n'ai rien entendu, répète s'il te plaît.","fr",
			function(event)
			{
				if (event=="TERMINATED" || event=="CANCELLED")
				{
					karotz.asr.string("10|20|30|40|50|60|70|80|90|100","fr",choixdechiffres2);
				}
			});
		}
		else
		{
			karotz.tts.start("Bon baya personne...","fr",exitFunction);
		}
	}
	else
	{
		tentatives=0;
		if (asrResult.text == "<nomatch>")
		{
			karotz.led.light("FF0000");
			karotz.tts.start("Je suis désolé, je n'ai pas compris. Répète ton nombre, s'il te plait. Ta réponse doit être un multiple de 10, compris entre 10 et 100 inclus.","fr",
			function(event)
			{
				if (event=="TERMINATED" || event=="CANCELLED")
				{
					karotz.asr.string("10|20|30|40|50|60|70|80|90|100","fr",choixdechiffres2);
				}
			});	
		}
		else
		{
			karotz.led.light("66FFFF");
			parmi = parseInt(asrResult.text);
			karotz.tts.start("Ok, je vais choisir des nombres entre 1 et "+parmi+". Combien de nombres, jusqu'à 10 nombres, veux-tu que je choisisse?", "fr", 
			function(event)
			{
				if (event=="CANCELLED" || event=="TERMINATED")
				{
					karotz.asr.string("1|2|3|4|5|6|7|8|9|10","fr",choixdechiffres);					
				}
			});
		}
	}
}

var QueChoisir = function(event)
{
	if (event=="CANCELLED" || event=="TERMINATED")
	{
		karotz.asr.string("10|20|30|40|50|60|70|80|90|100", "fr",choixdechiffres2);
	}
}

var NombreAuPif = function() 
{
	tentatives=0;
	karotz.led.light("66FFFF");
	karotz.tts.start("Parmi combien de nombres veux-tu que je choisisse?","fr",QueChoisir);
}

var PasCompris = function(result)
{
	karotz.led.light("FF0000");
	if (tentatives<3)
	{
		if (result.semantic == "No result before the no-input timeout")
		{
			tentatives++;
			karotz.tts.start("Je n'ai rien entendu, répète s'il te plaît.","fr",Ecouter);
		}
		else
		{
			tentatives=0;
			karotz.tts.start("Je n'ai pas compris. Dis, pile ou face, oui ou non, nombre au pif, grille de loto, euro millions, ou deviner ton chiffre.", "fr",Ecouter);
		}
	}
	else
	{
		karotz.tts.start("Bon baya personne...","fr",exitFunction);
	}
}

var EvalueChiffre = function(asrResult)
{
	if (asrResult.semantic == "No result before the no-input timeout")
	{
		karotz.led.light("FF0000");
		if (tentatives<3)
		{
			tentatives++;
			karotz.tts.start("Je n'ai rien entendu, répète s'il te plait.","fr",
			function(event)
			{
				if (event=="TERMINATED" || event=="CANCELLED")
				{
					karotz.asr.string(sss,"fr",EvalueChiffre);
				}
			});
		}
		else
		{
			karotz.tts.start("Bon baya personne...","fr",exitFunction);
		}
	}
	else
	{
		tentatives=0;
		if (asrResult.text=="<nomatch>")
		{
			karotz.led.light("FF0000");
			karotz.tts.start("Je suis désolé, je n'ai pas compris. Répète ton nombre, s'il te plait.","fr",
			function(event)
			{
				if (event=="TERMINATED" || event=="CANCELLED")
				{
					karotz.asr.string(sss,"fr",EvalueChiffre);
				}
			});
		}
		else
		{
			karotz.led.light("66FFFF");
			if (asrResult.text == "J'abandonne")
			{
				karotz.tts.start("Perdu. Je pensais au nombre "+MonChiffre.toString()+". Tu feras mieux la prochaine fois.","fr",exitFunction);
			}
			else
			{
				Record++;
				var b = parseInt(asrResult.text);
				if (b == MonChiffre)
				{
					karotz.tts.start("Bravo! C'était bien au "+MonChiffre.toString()+" que je pensais. Bien joué, ton score est de "+Record+" essais.","fr",exitFunction);
				}
				else
				{
					var plus_ou_moins;
					if (b<MonChiffre)
					{
						plus_ou_moins="Plus que "+b;
					}
					else
					{
						plus_ou_moins="Moins que "+b;
					}
					karotz.tts.start(plus_ou_moins,"fr",
					function(event)
					{
						if (event=="TERMINATED" || event=="CANCELLED")
						{
							karotz.asr.string(sss,"fr",EvalueChiffre);
						}
					});
				}
			}
		}
	}
}

var DevineChiffre = function()
{
	tentatives=0;
	MonChiffre = (Math.floor(Math.random()*101));
	for (var a=0; a<100; a++)
	{
		sss += a+"|";
	}
	sss+="100|J'abandonne";
	karotz.led.light("66FFFF");
	karotz.tts.start("Je pense à un nombre compris entre 0 et 100 inclus. Sauras-tu lequel? Je t'écoute.","fr",
	function(event)
	{
		if (event=="TERMINATED" || event=="CANCELLED")
		{
			karotz.asr.string(sss,"fr",EvalueChiffre);
		}
	});	
}

var GrilleLoto = function()
{
	karotz.led.light("66FFFF");
	var grille = new Array();
	while(grille.length<5)
	{
		var randomn=Math.floor(Math.random()*49+1);
		var found=false;
		for (var m=0; m<grille.length; m++)
		{
			if(grille[m]==randomn)
			{
				found=true;
				break;
			}
		}
		if(!found)
		{
			grille[grille.length]=randomn;
		}
	}
	karotz.tts.start("Joue pour moi cette grille de loto: ","fr",
	function(event)
	{
		if (event=="CANCELLED" || event=="TERMINATED")
		{
			var ssss = "";
			var mot = "Le ";
			for(var c=0; c<5; c++)
			{
				switch (c)
				{
					case 0:
						mot="Le ";
						break;
					case 4:
						mot=". Et le ";
						break;
					default:
						mot=". Le ";
						break;
				}
				ssss += mot+grille[c].toString();
			}	
			ssss += ". Mon numéro complémentaire sera le "+(Math.floor(Math.random()*10+1)).toString()+", s'il te plait. Et n'oublie pas de m'acheter des carottes si tu gagnes.";
			karotz.tts.start(ssss,"fr",exitFunction);
		}
	});
}

var EuroMillions = function()
{
	karotz.led.light("66FFFF");
	var grille = new Array();
	while(grille.length<5)
	{
		var randomn=Math.floor(Math.random()*50+1);
		var found=false;
		for (var m=0; m<grille.length; m++)
		{
			if(grille[m]==randomn)
			{
				found=true;
				break;
			}
		}
		if(!found)
		{
			grille[grille.length]=randomn;
		}
	}
	karotz.tts.start("Joue pour moi cette grille d'Euro Millions: ","fr",
	function(event)
	{
		if (event=="CANCELLED" || event=="TERMINATED")
		{
			var ssss = "";
			var mot = "Le ";
			for(var c=0; c<5; c++)
			{
				switch (c)
				{
					case 0:
						mot="Le ";
						break;
					case 4:
						mot=". Et le ";
						break;
					default:
						mot=". Le ";
						break;
				}
				ssss += mot+grille[c].toString();
			}

			var etoile1 = (Math.floor(Math.random()*11+1)).toString();
			var etoile2 = 0;
			do 
			{
				etoile2 = (Math.floor(Math.random()*11+1)).toString();
			} 
			while (etoile2 == etoile1);

			ssss += ". Mes deux étoiles seront le "+(Math.floor(Math.random()*10+1)).toString()+" et le "+(Math.floor(Math.random()*10+1)).toString()+", s'il te plait. Reste maître du jeu, ne t'endette pas pour jouer.";
			karotz.tts.start(ssss,"fr",exitFunction);
		}
	});
}

var OuiOuNon = function()
{
	karotz.led.light("66FFFF");
	karotz.button.addListener(buttonListener2);
	karotz.tts.start("Pose-moi des questions, je te répondrai par oui ou non. Si tu n'as plus de questions, appuie sur le bouton.","fr",
	function(event)
	{
		if (event=="TERMINATED" || event=="CANCELLED")
		{
			karotz.asr.string("Question","fr",OuiOuNonProcess);
		}
	});
}

var OuiOuNonProcess = function(asrResult)
{
	if (asrResult.semantic != "No result before the no-input timeout")
	{
		tentatives=0;
		karotz.led.light("66FFFF");

		var randomnumb=Math.floor(Math.random()*19);
		var result="";
				
		switch(randomnumb)
		{
			case 0:
			  result="Oui!"; //oui
			  break;
			case 1:
			  result="Très certainement!"; //oui
			  break;
			case 2:
			  result="Non!"; //non
			  break;
			case 3:
			  result="Sûrement pas."; //non
			  break;
			case 4:
			  result="Je suis pour."; //oui
			  break;
			case 5:
			  result="Je ne pense pas."; //non
			  break;
			case 6:
			  result="Mais bien sûr!"; //oui
			  break;
			case 7:
			  result="Catégoriquement non."; //non
			  break;
			case 8:
			  result="Affirmatif!"; //oui
			  break;
			case 9:
			  result="Positif!"; //oui
			  break;
			case 10:
			  result="Négatif!"; //non
			  break;
			case 11:
			  result="Niet!"; //non
			  break;
			case 12:
			  result="Pas du tout."; //non
			  break;
			case 13:
			  result="Assurément!"; //oui
			  break;
			case 14:
			  result="Mais naturellement."; //oui
			  break;
			case 15:
			  result="Ah que non."; //non
			  break;
			case 16:
			  result="Pas d'accord."; //non
			  break;
			case 17:
			  result="Yes!"; //oui
			  break;
			default:
			  result="Je ne sais pas...";
			  break;
		}
		karotz.tts.start(result,"fr",
		function(event)
		{
			if (event=="TERMINATED" || event=="CANCELLED")
			{
				karotz.asr.string("Question","fr",OuiOuNonProcess);
			}
		});
	}
	else
	{
		karotz.led.light("FF0000");
		if (tentatives<3)
		{
			tentatives++;
			karotz.tts.start("Je n'ai rien entendu, répète s'il te plaît.","fr",
			function(event)
			{
				if (event=="TERMINATED" || event=="CANCELLED")
				{
					karotz.asr.string("Question","fr",OuiOuNonProcess);
				}
			});	
		}
		else
		{
			karotz.tts.start("Bon baya personne...","fr",exitFunction);
		}
	}
}

var ChoixFonction = function(asrResult)
{
	if(asrResult.text == "Pile ou face" || asrResult.text == "Pile" || asrResult.text == "Face")
	{
		PileOuFace();
	}
	else
	{
		if (asrResult.text == "Nombre au pif")
		{
			NombreAuPif();
		}
		else
		{
			if (asrResult.text == "Deviner ton chiffre" || asrResult.text == "Deviner")
			{
				DevineChiffre();
			}
			else
			{
				if (asrResult.text == "Grille de loto" || asrResult.text == "Loto")
				{
					GrilleLoto();
				}
				else
				{
					if (asrResult.text == "Oui ou non")
					{
						OuiOuNon();
					}
					else
					{
						if (asrResult.text == "Euro" || asrResult.text == "Euro Millions" || asrResult.text == "Millions")
						{
							EuroMillions();
						}
						else
						{
							PasCompris(asrResult);
						}
					}
				}
			}
		}
	}
}

var Ecouter = function(event)
{
	if (event=="TERMINATED" || event=="CANCELLED")
	{
		karotz.asr.string("(Pile [ou face]|Face)|Oui ou non|Nombre au pif|(Grille de loto|Loto)|(Deviner [ton chiffre])|(Euro [Millions]|Millions)","fr",ChoixFonction);
	}
}

var onKarotzConnect = function(data) {
    karotz.button.addListener(buttonListener); //Sert à sortir de l'app en cas de double clic
	karotz.tts.start("Que faire?","fr",Ecouter);
	return true;
}

karotz.connectAndStart(karotz_ip, 9123, onKarotzConnect, {});
