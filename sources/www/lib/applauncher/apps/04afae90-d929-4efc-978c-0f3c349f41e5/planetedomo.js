////////////////////////////////////////////////////////////////////////////////////////
//(C) 2011 - VIALAT Mickaël 
//
// Boutique en ligne de produit domotique : http://www.planete-domotique.com 
//
// This code is free software; you can redistribute it and/or
// modify it under the terms of the GNU Lesser General Public 
// License as published by the Free Software Foundation; either 
// version 2.1 of the License, or (at your option) any later version.
//
// This code is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU Lesser General Public License for more details.
//
// You should have received a copy of the GNU Lesser General Public 
// License along with this program; if not, write to the Free 
// Software Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA  02111-1307, USA.
//
////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////
//  Fonction utile pour l'encodage des urls avant l'utilisation 
//  du http.get ou http.post
function urlencode(str) 
{
    return escape(str.replace(/%/g, '%25').replace(/\+/g, '%2B')).replace(/%25/g, '%');
}

// Chaque lancement d'action est identifié de manière unique
var g_idAction = 0;

// On utilise une chaîne pour marquer les actions qui doivent être annulée 
// Pour chaque action à annuler, on ajoute #idAction# dans la chaîne
var abortedActions = ""; 

///////////////////////////////////////////////////////////////////////////////////////
/// FONCTIONS DE GESTION D'UN AUTOMATE D'ETAT
///////////////////////////////////////////////////////////////////////////////////////
//  Les fonctions suivantes permettent la gestion d'un automate d'état.
//  Dans votre code, il faut créer une fonction de gestion de l'automate:
//          function automate(num) {
//              switch (num) {
//              case 0: 
//                  // Fonction à l'étape 0
//              break;
//              case 1:
//                  // Fonction à l'étape 1
//              break;
//              }
//          }
// 
///////////////////////////////////////////////////////////////////////////////////////
// Dans le cas d'utilisation d'un automate d'état, cette fonction
// permet de passer à l'étape suivante (num) en faisant une pause de
// durée delay avant.
// La fonction renvoi l'id du Timer permettant le passage à l'étape 
// suivante. Cela permettra éventuellement d'interrompre l'opération 
// en utilisant le stopAction
function execAction(num, delay)
{
    g_idAction++;
    
    var id = g_idAction;
    
    // Défini un timeout qui permettra de passer à l'étape suivante après le temps delay
    setTimeout(delay, function() 
                      {
                          log("Id de l'action : "+id+" - Etape : "+num+" - Delay : "+delay);
                          // On contrôle si l'action n'a pas été annulée
                          if (abortedActions.indexOf("#"+id+"#")!=-1)
                            abortedActions = abortedActions.replace("#"+id+"#", "");
                          else 
                            automate(num); 
                            
                          log("abortedActions : "+abortedActions);
                          
                          return false; 
                      });
    
    return id;  
}

///////////////////////////////////////////////////////////////////////////////////////
// Interromp le passage à l'étape suivante dans le cas d'un automate d'état
// L'id passé en paramètre doit être celui retourné par la fonction execAction
// Cet id correspond au timer utilisé pour passé entre chaque étape...
function stopAction(idAbortAction)
{
    log("Ajout action stop : " + idAbortAction);
    abortedActions += "#"+idAbortAction+"#";
}

///////////////////////////////////////////////////////////////////////////////////////
// La fonction speakAndGoto permet de prononcer un text en TTS, puis d'aller à l'étape
// num de l'automate d'état. Il est possible de spécifier un delais (delay)
// entre la fin de la prononciation du texte et le passage à l'étape suivante.
function speakAndGoto(txt, num, delay)
{
  /*karotz.tts.stop();*/
  
  karotz.tts.start(txt, "fr", function(event) { 
                                  if (event=="TERMINATED") 
                                  { 
                                      execAction(num, delay); 
                                  }
                                  
                                  return true; 
                              });
}

///////////////////////////////////////////////////////////////////////////////////////
// La fonction playAndGoto permet de lire un fichier multimedia, puis d'aller à l'étape
// num de l'automate d'état. Il est possible de spécifier un delais (delay)
// entre la fin de la prononciation du texte et le passage à l'étape suivante.
function playAndGoto(url, num, delay)
{
  karotz.multimedia.play(url, function(event) { 
                                  if (event=="TERMINATED") 
                                  { 
                                      execAction(num, delay); 
                                  }
                                  
                                  return true; 
                              });
}

///////////////////////////////////////////////////////////////////////////////////////
// Permet de sauvegarder un paramètre en local sur le Karotz
function saveLocalParameter(key, value) 
{ 
  var jsonText = JSON.stringify(value); 
  file.write("params/" + key + ".js", jsonText); 
}; 

///////////////////////////////////////////////////////////////////////////////////////
// Permet de charger un paramètre en local sur le Karotz
function loadLocalParameter(key) 
{ 
  try
  {
      var filename = "params/" + key + ".js"; 
      log("loading resource: " + filename); 
      var rs = file.read(filename); 
      
      log("resource content: " + rs.text); 
      return eval('(' + rs.text + ')'); 
  }
  catch (error)
  {
      log("Exception : " + error);
      saveLocalParameter(key, "");
      
      return "";
  }  
};