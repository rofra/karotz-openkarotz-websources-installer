#!/usr/bin/env python
#
# Library to launch Karotz App with a given configuration
#
import socket
import re
import urllib
import os
import pprint
import subprocess, time, shlex

class LauncherLibKarotz(object):
   def log(self, string):
       self.mylog = string
       print self.mylog

#   pathToApps = '/usr/karotz/apps'
   pathToTmpDir = '/tmp/tmpapp/'
   
   # Init the main variables out of constructor
   def init(self, pathToApps):
       if not os.path.isdir(pathToApps):
           raise Exception('directorynotfound')
       self.pathToApps = pathToApps
   
   def launch(self, appcode, appconfig, configlibkarotz):
       try:
           self.pathToApps
       except:
           raise Exception('configurationnotset')
        
       self.appcode = appcode
       self.appconfig = appconfig
       
       dirpath = self.pathToApps + '/' + appcode + '/'
       newpath = self.pathToTmpDir + '/' + appcode + '/'
       configPath = newpath + '/ALTERNATECONFIG.js'
       inputPath = newpath + '/STDIN'
       
       if not os.path.isdir(dirpath): 
          raise Exception('appdirnotfound')
   
       self.log("Copying Directory")
       os.system('mkdir -p %s' % self.pathToTmpDir)
       os.system('rm -fr %s' % newpath)
       os.system('cp -fr "%s" "%s"' % (dirpath, newpath))
       
       self.log('Generating JS Configuration')
       confElement = configlibkarotz.extractConfigByAppCodeAndConfig(self.appcode, self.appconfig)
       
       if (confElement == None): 
           raise Exception('appconfignotfound')
       
       stringConf = configlibkarotz.formatConfigInstance(confElement)
       
       self.log('Writing JS Configuration to disk')
       fd = open(configPath, "w")
       fd.write(stringConf)
       fd.close()
       
       if os.path.isfile("%s/main.js" % newpath): 
           self.log('Modifying the main.js file to add the custom configuration')
           os.system('cp -f %s/main.js %s/main.js.old' % (newpath,newpath))
           os.system('echo \'include("ALTERNATECONFIG.js")\' > %s/main.js'%(newpath))
           os.system('cat %s/main.js.old >> %s/main.js'%(newpath, newpath))
           os.system('rm -f %s/main.js.old'%(newpath))
       
       self.log('Launching the command line')
       stdin = '%s SCHEDULER %s\\n\\n' % (self.appcode, self.appconfig)
       cmd = 'printf "%s" > %s' % (stdin, inputPath)
       os.system(cmd)
       
       #cmd = '/usr/karotz/bin/karotzVM --app_folder=%s < %s 1>/dev/null 2>&1 ' % (self.pathToTmpDir, inputPath)
       cmd = '/usr/karotz/bin/karotzVM --app_folder=%s < %s ' % (self.pathToTmpDir, inputPath)

       self.log(cmd)
       os.system(cmd)
       
       # Never stop the process
       #time.sleep(5000000)   
          
