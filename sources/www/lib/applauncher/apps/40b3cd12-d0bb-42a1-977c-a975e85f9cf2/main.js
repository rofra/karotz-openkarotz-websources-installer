include("util.js");

var sounds=[
"http://www.krakrakra.com/IMG/mp3_Blague_n100.mp3",
"http://www.krakrakra.com/IMG/mp3_Blague_n50.mp3" ,
"http://www.krakrakra.com/IMG/mp3_Blague_n51.mp3" ,
"http://www.krakrakra.com/IMG/mp3_Blague_n52.mp3" ,
"http://www.krakrakra.com/IMG/mp3_Blague_n53.mp3" ,
"http://www.krakrakra.com/IMG/mp3_Blague_n54.mp3" ,
"http://www.krakrakra.com/IMG/mp3_Blague_n56.mp3" ,
"http://www.krakrakra.com/IMG/mp3_Blague_n57.mp3" ,
"http://www.krakrakra.com/IMG/mp3_Blague_n58.mp3" ,
"http://www.krakrakra.com/IMG/mp3_Blague_n59.mp3" ,
"http://www.krakrakra.com/IMG/mp3_Blague_n60.mp3" ,
"http://www.krakrakra.com/IMG/mp3_Blague_n61.mp3" ,
"http://www.krakrakra.com/IMG/mp3_Blague_n62.mp3" ,
"http://www.krakrakra.com/IMG/mp3_Blague_n63.mp3" ,
"http://www.krakrakra.com/IMG/mp3_Blague_n64.mp3" ,
"http://www.krakrakra.com/IMG/mp3_Blague_n65.mp3" ,
"http://www.krakrakra.com/IMG/mp3_Blague_n66.mp3" ,
"http://www.krakrakra.com/IMG/mp3_Blague_n67.mp3" ,
"http://www.krakrakra.com/IMG/mp3_Blague_n68.mp3" ,
"http://www.krakrakra.com/IMG/mp3_Blague_n69.mp3" ,
"http://www.krakrakra.com/IMG/mp3_Blague_n70.mp3" ,
"http://www.krakrakra.com/IMG/mp3_Blague_n71.mp3" ,
"http://www.krakrakra.com/IMG/mp3_Blague_n72.mp3" ,
"http://www.krakrakra.com/IMG/mp3_Blague_n73.mp3" ,
"http://www.krakrakra.com/IMG/mp3_Blague_n74.mp3" ,
"http://www.krakrakra.com/IMG/mp3_Blague_n75.mp3" ,
"http://www.krakrakra.com/IMG/mp3_Blague_n76.mp3" ,
"http://www.krakrakra.com/IMG/mp3_Blague_n77.mp3" ,
"http://www.krakrakra.com/IMG/mp3_Blague_n78.mp3" ,
"http://www.krakrakra.com/IMG/mp3_Blague_n79.mp3" ,
"http://www.krakrakra.com/IMG/mp3_Blague_n80.mp3" ,
"http://www.krakrakra.com/IMG/mp3_Blague_n81.mp3" ,
"http://www.krakrakra.com/IMG/mp3_Blague_n82.mp3" ,
"http://www.krakrakra.com/IMG/mp3_Blague_n83.mp3" ,
"http://www.krakrakra.com/IMG/mp3_Blague_n84.mp3" ,
"http://www.krakrakra.com/IMG/mp3_Blague_n85.mp3" ,
"http://www.krakrakra.com/IMG/mp3_Blague_n86.mp3" ,
"http://www.krakrakra.com/IMG/mp3_Blague_n87.mp3" ,
"http://www.krakrakra.com/IMG/mp3_Blague_n88.mp3" ,
"http://www.krakrakra.com/IMG/mp3_Blague_n89.mp3" ,
"http://www.krakrakra.com/IMG/mp3_Blague_n90.mp3" ,
"http://www.krakrakra.com/IMG/mp3_Blague_n91.mp3" ,
"http://www.krakrakra.com/IMG/mp3_Blague_n92.mp3" ,
"http://www.krakrakra.com/IMG/mp3_Blague_n93.mp3" ,
"http://www.krakrakra.com/IMG/mp3_Blague_n94.mp3" ,
"http://www.krakrakra.com/IMG/mp3_Blague_n95.mp3" ,
"http://www.krakrakra.com/IMG/mp3_Blague_n96.mp3" ,
"http://www.krakrakra.com/IMG/mp3_Blague_n97.mp3" ,
"http://www.krakrakra.com/IMG/mp3_Blague_n98.mp3" ,
"http://www.krakrakra.com/IMG/mp3_Blague_n99.mp3"
];

var soundPath = sounds[Math.floor(Math.random()*sounds.length)];

var karotz_ip="localhost"

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

var onKarotzConnect = function(data) {
    karotz.button.addListener(buttonListener);
    karotz.multimedia.play(soundPath, exitFunction);
}

karotz.connectAndStart(karotz_ip, 9123, onKarotzConnect, {});
