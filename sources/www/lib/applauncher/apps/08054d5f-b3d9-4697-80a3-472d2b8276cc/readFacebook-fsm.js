var readFacebookFsm = StateMachine.create({
  events: [
    { name: 'readFacebook',     from: 'none',  to: 'FacebookInit' },
    { name: 'stop',             from: 'none',  to: 'End' },
    
    { name: 'simpleClick',      from: 'FacebookInit',           to: 'FacebookDirect'  },
    { name: 'stop',             from: 'FacebookInit',           to: 'End'  }, 
    { name: 'longClick',        from: 'FacebookInit',           to: 'End' },
    
    { name: 'noConf',           from: 'none',                   to: 'FacebookNoConfError' },
    { name: 'stop',             from: 'FacebookNoConfError',    to: 'End' },
    
    { name: 'next',             from: 'FacebookDirect',        to: 'FacebookDirectNext' },
    { name: 'next',             from: 'FacebookDirectNext',    to: 'FacebookDirect' },
    { name: 'simpleClick',      from: 'FacebookDirect',        to: 'FacebookDirectSkip' },
    { name: 'longClick',        from: 'FacebookDirect',        to: 'FacebookDirectStop' },
    { name: 'next',             from: 'FacebookDirectSkip',    to: 'FacebookDirectNext' },
    { name: 'next',             from: 'FacebookDirectStop',    to: 'FacebookNotification' },
    { name: 'nexttype',         from: 'FacebookDirect',        to: 'FacebookNotification' },
    { name: 'stop',             from: 'FacebookDirect',        to: 'End' },
    { name: 'stop',             from: 'FacebookDirectStop',    to: 'End' },
    { name: 'stop',             from: 'FacebookDirectSkip',    to: 'End' },
    { name: 'stop',             from: 'FacebookDirectNext',    to: 'End' },
    
    { name: 'next',             from: 'FacebookNotification',       to: 'FacebookNotificationNext' },
    { name: 'next',             from: 'FacebookNotificationNext',   to: 'FacebookNotification' }, 
    { name: 'simpleClick',      from: 'FacebookNotification',       to: 'FacebookNotificationSkip' },
    { name: 'longClick',        from: 'FacebookNotification',       to: 'onFacebookNotificationStop' },
    { name: 'next',             from: 'FacebookNotificationSkip',   to: 'FacebookNotificationNext' },
    { name: 'next',             from: 'onFacebookNotificationStop', to: 'FacebookWall' },
    { name: 'nexttype',         from: 'FacebookNotification',       to: 'FacebookWall' },
    { name: 'stop',             from: 'FacebookNotification',       to: 'End' },
    { name: 'stop',             from: 'FacebookNotificationNext',   to: 'End' },
    { name: 'stop',             from: 'FacebookNotificationSkip',   to: 'End' },
    { name: 'stop',             from: 'onFacebookNotificationStop', to: 'End' },

    { name: 'next',             from: 'FacebookWall',        to: 'FacebookWallNext' },
    { name: 'next',             from: 'FacebookWallNext',    to: 'FacebookWall' },
    { name: 'simpleClick',      from: 'FacebookWall',        to: 'FacebookWallSkip' },
    { name: 'longClick',        from: 'FacebookWall',        to: 'FacebookWallStop' },
    { name: 'next',             from: 'FacebookWallSkip',    to: 'FacebookWallNext' },
    { name: 'next',             from: 'FacebookWallStop',    to: 'FacebookStream' },
    { name: 'stop',             from: 'FacebookWall',        to: 'FacebookStream' },
    { name: 'nexttype',         from: 'FacebookWall',        to: 'FacebookStream' },
    { name: 'stop',             from: 'FacebookWall',        to: 'End' },
    { name: 'stop',             from: 'FacebookWallNext',    to: 'End' },
    { name: 'stop',             from: 'FacebookWallSkip',    to: 'End' },
    { name: 'stop',             from: 'FacebookWallStop',    to: 'End' },

    { name: 'next',             from: 'FacebookStream',        to: 'FacebookStreamNext' },
    { name: 'next',             from: 'FacebookStreamNext',    to: 'FacebookStream' },
    { name: 'simpleClick',      from: 'FacebookStream',        to: 'FacebookStreamSkip' },
    { name: 'longClick',        from: 'FacebookStream',        to: 'FacebookStreamStop' },
    { name: 'next',             from: 'FacebookStreamSkip',    to: 'FacebookStreamNext' },
    
    { name: 'next',             from: 'FacebookStreamStop',    to: 'End' },
    { name: 'stop',             from: 'FacebookStream',        to: 'End' },
    { name: 'stop',             from: 'FacebookStreamNext',    to: 'End' },
    { name: 'stop',             from: 'FacebookStreamSkip',    to: 'End' },
    { name: 'stop',             from: 'FacebookStreamStop',    to: 'End' },
       
    { name: 'stop',             from: 'FacebookMessage',       to: 'End' },
]});

//log(readFacebookFsm.genGraph())
//exit()
