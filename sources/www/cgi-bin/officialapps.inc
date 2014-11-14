function LaunchOfficialApp {
    APPNAME=$1
    CONFIGNAME=$2

    Leds A05F2D 000000 1 1

    FULLSCRIPTPATH="$(cd "${0%/*}" 2>/dev/null; echo "$PWD"/"${0##*/}")"
    SCRIPTDIR=$(dirname ${FULLSCRIPTPATH}) 

    # Kill previous process if exists                       
    ${SCRIPTDIR}/../lib/applauncher/killpreviouslaunch 1>/dev/null 2>&1
                                                                 
    # Color me                                      
    Leds 601FED 000000 1 1                          

    ${SCRIPTDIR}/../lib/applauncher/launchapp -a "${APPNAME}" -c "${CONFIGNAME}" 1>/dev/null 2>&1 &
#    ${SCRIPTDIR}/../lib/applauncher/launchapp -a "${APPNAME}" -c "${CONFIGNAME}"
}

function KillLastOfficialApp {
    FULLSCRIPTPATH="$(cd "${0%/*}" 2>/dev/null; echo "$PWD"/"${0##*/}")"                                                                        
    SCRIPTDIR=$(dirname ${FULLSCRIPTPATH})  
    
    ${SCRIPTDIR}/../lib/applauncher/killpreviouslaunch 1>/dev/null 2>&1
#    bash -x ${SCRIPTDIR}/../lib/applauncher/killpreviouslaunch
}
