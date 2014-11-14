#!/usr/bin/env python
#
# Library to manage Karotz App configuration from Single XML File
# @author Rodolphe Franceschi <rodolphe.franceschi@gmail.com>
# 
# Here is the format of the javascript generated at the end:
# ----------------------------------------------------------
# var params = {
#    config: {
#       awake: "true",
#       content: "1",
#       interruptible: "true",
#       number: "5",
#       permanentTriggerActivator: "false",
#       scheduledDateTriggerActivator: "false",
#       scheduledTriggerActivator: "false",
#       uuid: "2149cac0-a1c0-49da-a0b0-d8d5cdb0340c",
#       token: "a7ba610b-4842-43cd-8cfc-3d6bda20035c
#    }
# };
# var instanceName = "config";

#
import socket
import re
import urllib
import os
import pprint
import array
import subprocess
from xml.dom.minidom import xml
import simplejson

class ConfigurationLibKarotz(object):
    def log(self, string):
       self.mylog = string
       print "%s" % self.mylog

    # Init the main variables out of constructor
    def init(self, pathToConfigFile):
        if not os.path.isfile(pathToConfigFile):
            raise Exception('configfilenotfound')
        self.configfilepath = pathToConfigFile

   
    # Extract the list of Xml Elements relative to one appcode
    def extractConfigListByAppCode(self, appcode):
        self.log("Extracting config for app code %s" % appcode)
        nodeList = self.extractConfigByAppCode(appcode)
        
        subNodeList = []
        for node in nodeList:
            subNodeListTmp = node.getElementsByTagName('configInstance')
            subNodeList = subNodeListTmp + subNodeList
    
        self.log("%s config found for app %s" % (len(subNodeList), appcode))
        return subNodeList
        
    def unescape(self, s):
        result = ""
        while len(s) > 0:
            if s[0] == "\\":
                (octbyte, s) = (s[1:4], s[4:])
                try:
                    result += chr(int(octbyte, 8))
                except ValueError:
                    result += "\\"
                    s = octbyte + s
            else:
                result += s[0]
                s = s[1:]
        return result
        
    # Extract the Xml Element relative to one appcode AND appconfig
    def extractConfigByAppCodeAndConfig(self, appcode, appconfig):
        self.log("Extracting config for app code %s/%s" % (appcode, appconfig))
        nodeList = self.extractConfigListByAppCode(appcode)
        
        config = None
        for node in nodeList:
            if (node.getElementsByTagName('name')[0].firstChild.nodeValue == '"%s"' % appconfig): 
                return node
        return None
        
    def retPrettyPrint(self, doc):
        t = cStringIO.StringIO()
        ext.PrettyPrint(doc,t, encoding='ISO-8859-1')
        return t.getvalue()
    
    # Extract the names of the apps from configuration file
    def extractAppNameAndConfigFromConfigFile(self, configfilepath, indexFilePath):
        if not os.path.isfile(configfilepath):
            raise Exception('configurationnotfound')
        
        confList = []
        
        dom = xml.dom.minidom.parse(configfilepath)
        name = dom.getElementsByTagName('name')[0].firstChild.nodeValue
        apiKey = dom.getElementsByTagName('apiKey')[0].firstChild.nodeValue
        
        nameold = name.decode('string_escape')
        
        # Prepare app name
        name = nameold[:40]
        
        for configInstance in dom.getElementsByTagName('configInstance'):
            configname = configInstance.getElementsByTagName('name')[0].firstChild.nodeValue
            objeccc = {'appcode': re.sub('"', '', apiKey) , 'configname': re.sub('"', '', configname), 'name': re.sub('"', '', name) }
            
            line = simplejson.dumps(objeccc)
            confList.append(line)
        
        fullReturn = "".join(confList)
        
        # Write to disk
        fd = open(indexFilePath, "w")
        fd.write(fullReturn)
        fd.close()
        
        self.log("File %s Successfully generated" % indexFilePath)
        
        return fullReturn   
    
    # Extract the Xml Element with all the configurations relative to one appcode
    def extractConfigByAppCode(self, appcode):
        try:
            self.configfilepath
        except:
            raise Exception('configurationnotset')
        
        self.log("Parsing XML")
        dom = xml.dom.minidom.parse(self.configfilepath)
        
        nodeList = []
        
        self.log("Going throw nodes in XML")
        
        for apikeyNode in dom.getElementsByTagName('apiKey'):
            apiKeyK = apikeyNode.firstChild.nodeValue
            
            self.log('APIK = %s' % apiKeyK)
            if (apiKeyK == '"%s"' % appcode): 
                nodeList.append(apikeyNode.parentNode)
                
        numFound = len(nodeList)
        self.log("Debug: %s elements found :)" % numFound)
        
        if (numFound == 0): 
            raise Exception('noconfigurationfound')
    
        return nodeList
        

    # Format the configuration the javascript way
    def formatConfigInstance(self, node):
        configName = node.getElementsByTagName('name')[0].firstChild.nodeValue
        uuid = node.getElementsByTagName('uuid')[0].firstChild.nodeValue 
        
        varList = []
        # First, extract all variables
        for paramnode in node.getElementsByTagName('params'):
            key = paramnode.getElementsByTagName('key')[0].firstChild.nodeValue
            value = paramnode.getElementsByTagName('value')[0].firstChild.nodeValue
            
            varChain = '%s: %s' % (re.sub('"', '', key), value)
            varList.append(varChain)
        
        # Append the uuid
        varList.append('uuid: %s' % (uuid))
        
        # Append a uniq token
        tokenCmd = ["cat", "/proc/sys/kernel/random/uuid"]
        process = subprocess.Popen(tokenCmd,  stdout=subprocess.PIPE,  stderr=subprocess.PIPE)
        out, err = process.communicate()
        outClean =  re.sub("\n", "", out)
        varList.append('token: "%s"' % (outClean))
        
        # Concat the string the javascript way
        carListString = ", \n        ".join(varList)
        carListString = "        " + carListString
        
        cStripped = re.sub('"', '',configName)
        head = 'var params = {\n\
   %s: {\n' % (cStripped)
   
        footer = '\n\
   }\n\
};\n\
var instanceName = "%s";\n\
' % (cStripped);

        fullString = head + carListString + footer
        
        return fullString
         
            
