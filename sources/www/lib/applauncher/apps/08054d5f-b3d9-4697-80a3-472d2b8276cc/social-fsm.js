var fsm = StateMachine.create({
  events: [
    { name: 'startup',     from: 'none',          to: 'ReadHelpInit' },
    { name: 'startupWait',  from: 'none',          to: 'WaitAction' },
    { name: 'next',  from: 'WaitAction',          to: 'WaitAction' },
    { name: 'noToken',      from: 'none',          to: 'NoToken' },
    
    { name: 'next',        from: 'ReadHelpInit',  to: 'WaitAction' },
    { name: 'simpleClick', from: 'ReadHelpInit',  to: 'WaitAction' },
    { name: 'longClick',   from: 'ReadHelpInit',  to: 'AsrMain' },
    
    { name: 'readHelp',    from: 'AsrMain',   to: 'ReadHelp' },
    { name: 'next',        from: 'ReadHelp',  to: 'WaitAction' }, 
    { name: 'simpleClick', from: 'ReadHelp',  to: 'WaitAction' },
    { name: 'longClick',   from: 'ReadHelp',  to: 'AsrMain' },

    { name: 'longClick',      from: 'WaitAction',         to: 'AsrMain' },
    { name: 'error',            from: 'AsrMain',            to: 'WaitAction'  },

    { name: 'readFacebook',     from: 'WaitAction',         to: 'FacebookRun' }, 
    { name: 'readFacebook',     from: 'AsrMain',                to: 'FacebookRunAsr'  },
    { name: 'next',             from: 'FacebookRunAsr',            to: 'WaitAction'  },
    { name: 'readFacebookScheduler',     from: 'WaitAction',                to: 'FacebookRunScheduler'  },
    { name: 'next',             from: 'FacebookRunScheduler',            to: 'TwitterRunScheduler'  },
    { name: 'next',             from: 'TwitterRunScheduler',            to: 'WaitAction'  },
    { name: 'next',             from: 'FacebookRun',            to: 'WaitAction'  },
                   
    { name: 'readTwitter',      from: 'WaitAction',         to: 'TwitterRun' },                                          
    { name: 'readTwitter',      from: 'AsrMain',            to: 'TwitterRunAsr' },
    { name: 'next',             from: 'TwitterRunAsr',      to: 'WaitAction' },
    { name: 'next',             from: 'TwitterRun',         to: 'WaitAction'  },
    
    { name: 'takePhoto',        from: 'AsrMain',            to: 'PostPhoto' },
    { name: 'takePhoto',        from: 'WaitAction',         to: 'PostPhoto' },
    { name: 'next',             from: 'PostPhoto',              to: 'WaitAction' },
    
    { name: 'postMessage',      from: 'AsrMain',            to: 'RecordPostMessage' },
    { name: 'postMessage',      from: 'WaitAction',         to: 'RecordPostMessage' },
    { name: 'next',             from: 'RecordPostMessage',  to: 'WaitAction' },

    { name: 'postMessagePhoto', from: 'AsrMain',                 to: 'RecordPostMessagePhoto' },
    { name: 'postMessagePhoto', from: 'WaitAction',              to: 'RecordPostMessagePhoto' },
    { name: 'next',             from: 'RecordPostMessagePhoto',  to: 'WaitAction' },
    
    { name: 'postSound', from: 'AsrMain',                 to: 'PostSound' },
    { name: 'postSound', from: 'WaitAction',              to: 'PostSound' },
    { name: 'next',             from: 'PostSound',  to: 'WaitAction' },

    { name: 'readNotification', from: 'WaitAction',  to: 'FacebookNotificationRun' },
    { name: 'readNotification', from: 'AsrMain',  to: 'FacebookNotificationRun' },
    { name: 'next',             from: 'FacebookNotificationRun',  to: 'WaitAction' },
]});
