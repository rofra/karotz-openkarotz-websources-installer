include("util.js");

var karotz_ip="localhost"
//var karotz_ip="192.168.8.38"

var buttonListener = function(event) {
    switch (event) {
        case "SIMPLE":
            break;
        case "DOUBLE":
            karotz.tts.stop();
            exit();            
            break;  
    }

    return true;
}

// Traitement Listener RFID
var rfidListener = function (data) {
    // Attributes of rfid tag used
    tag_id = data.id; //Retrieves the RFID ID number scanned
    tag_app = data.app; // Not used at this time
    tag_color = data.color; //Retrieves the color of the RFID tag scanned
    tag_type = data.type; //Retrieves the type of tag scanned
    tag_direction = data.direction; //Asks the reader if the tag is on the reader or has left the reader
}


var exitFunction = function(event) {
    if((event == "CANCELLED") || (event == "TERMINATED")) {
        exit();
    }
    return true;
}


var randomMessage = function () {

    var random_number = Math.floor((Math.random() * 10)+1);
    var msg_id = "id"+ random_number;
    var message;

    log ("Message : >" + random_number +"<");

    switch (msg_id) {
        case "id1":
            message = params[instanceName].msg1;
            log ("Case 1");
            break;
        case "id2":
            message = params[instanceName].msg2;
            log ("Case 2");
            break;
        case "id3":
            message = params[instanceName].msg3;
            log ("Case 3");
            break;
        case "id4":
            message = params[instanceName].msg4;
            log ("Case 4");
            break;
        case "id5":
            message = params[instanceName].msg5;
            log ("Case 5");
            break;
        case "id6":
            message = params[instanceName].msg6;
            log ("Case 6");
            break;
        case "id7":
            message = params[instanceName].msg7;
            log ("Case 7");
            break;
        case "id8":
            message = params[instanceName].msg8;
            log ("Case 8");
            break;
        case "id9":
            message = params[instanceName].msg9;
            log ("Case 9");
            break;
        case "id10":
            message = params[instanceName].msg10;
            log ("Case 10");
            break;
    }

    karotz.tts.start(message, "fr", exitFunction);
    return true;
}

var onKarotzConnect = function(data) {
    karotz.button.addListener(buttonListener);
    //karotz.rfid.addListener(rfidListener);

    randomMessage();
}

karotz.connectAndStart(karotz_ip, 9123, onKarotzConnect, {});
