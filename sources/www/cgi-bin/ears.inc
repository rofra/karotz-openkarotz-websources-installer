#!/bin/bash

usedbus=0
uuid=$(uuidgen)

function EarsReset 
{  
    dbus-send --system --type=method_call --dest=com.mindscape.karotz.Ears /com/mindscape/karotz/Ears \
com.mindscape.karotz.KarotzInterface.reset string:$uuid string:1
}

function EarMoveRight
{
    dbus-send --system --type=method_call --dest=com.mindscape.karotz.Ears /com/mindscape/karotz/Ears \
com.mindscape.karotz.KarotzInterface.move_right string:$uuid string:1 string:3
}

function EarsMove 
{
     dbus-send --system --type=method_call --dest=com.mindscape.karotz.Ears /com/mindscape/karotz/Ears \
     com.mindscape.karotz.KarotzInterface.move string:$uuid int32:$1 int32:$3 int32:$2 int32:$3
     
}


function dbus_EarsStep {
    dbus-send --system --type=method_call --dest=com.mindscape.karotz.Ears /com/mindscape/karotz/Ears \
com.mindscape.karotz.KarotzInterface.move string:$uuid int32:$1 int32:$3 int32:$2 int32:$3  
 
}

