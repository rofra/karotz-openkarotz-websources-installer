var readTwitterFsm = StateMachine.create({
  events: [
    { name: 'readTwitter',      from: 'none',               to: 'TwitterMessageInit' },
    { name: 'readTwitter',      from: 'End',                to: 'TwitterMessageInit' },
    
    { name: 'noConf',           from: 'none',               to: 'TwitterNoConfError' },
    { name: 'stop',             from: 'TwitterNoConfError', to: 'End' },
                               
    { name: 'simpleClick',      from: 'TwitterMessageInit', to: 'TwitterDirect' },
    { name: 'stop',             from: 'TwitterMessageInit', to: 'End' },
    { name: 'mAsRead',          from: 'TwitterMessageInit', to: 'MarkAsRead' },
    
    { name: 'next',             from: 'MarkAsRead',         to: 'End' },
    
    { name: 'stop',             from: 'TwitterDirect',      to: 'End' },
    { name: 'stop',             from: 'TwitterDirectStop', to: 'End' },
    { name: 'stop',             from: 'TwitterDirectNext',  to: 'End' },
    { name: 'mAsRead',          from: 'TwitterDirect',      to: 'MarkAsRead' },
    { name: 'mAsRead',          from: 'TwitterDirectStop', to: 'MarkAsRead' },
    { name: 'mAsRead',          from: 'TwitterDirectNext',  to: 'MarkAsRead' },
    { name: 'simpleClick',      from: 'TwitterDirect',      to: 'TwitterDirectStop' },
    { name: 'next',             from: 'TwitterDirectStop', to: 'TwitterDirectNext' },
    { name: 'next',             from: 'TwitterDirect',      to: 'TwitterDirectNext' },
    { name: 'next',             from: 'TwitterDirectNext',  to: 'TwitterDirect' },
    { name: 'nexttype',         from: 'TwitterDirect',      to: 'TwitterMention' },
    { name: 'nexttype',         from: 'TwitterDirectNext',  to: 'TwitterMention' },
    
    
    { name: 'stop',             from: 'TwitterMention',     to: 'End' },
    { name: 'stop',             from: 'TwitterMentionStop', to: 'End' },
    { name: 'stop',             from: 'TwitterMentionNext', to: 'End' },
    { name: 'mAsRead',          from: 'TwitterMention',     to: 'MarkAsRead' },
    { name: 'mAsRead',          from: 'TwitterMentionStop', to: 'MarkAsRead' },
    { name: 'mAsRead',          from: 'TwitterMentionNext', to: 'MarkAsRead' },
    { name: 'simpleClick',      from: 'TwitterMention',     to: 'TwitterMentionStop' },
    { name: 'next',             from: 'TwitterMentionStop', to: 'TwitterMentionNext' },
    { name: 'next',             from: 'TwitterMention',     to: 'TwitterMentionNext' },
    { name: 'next',             from: 'TwitterMentionNext', to: 'TwitterMention' },
    { name: 'nexttype',         from: 'TwitterMention',     to: 'TwitterMessage' },
    { name: 'nexttype',         from: 'TwitterMentionNext', to: 'TwitterMessage' },

    { name: 'simpleClick',      from: 'TwitterMessage',     to: 'TwitterMessageStop' },
    { name: 'next',             from: 'TwitterMessageStop', to: 'TwitterMessageNext' },
    { name: 'next',             from: 'TwitterMessage',     to: 'TwitterMessageNext' },
    { name: 'next',             from: 'TwitterMessageNext', to: 'TwitterMessage' },
    { name: 'nexttype',         from: 'TwitterMessage',     to: 'End' },
    { name: 'nexttype',         from: 'TwitterMessageNext', to: 'End' },
    { name: 'stop',             from: 'TwitterMessage',     to: 'End' },
    { name: 'stop',             from: 'TwitterMessageStop', to: 'End' },
    { name: 'stop',             from: 'TwitterMessageNext', to: 'End' },
    { name: 'mAsRead',          from: 'TwitterMessage',     to: 'MarkAsRead' },
    { name: 'mAsRead',          from: 'TwitterMessageStop', to: 'MarkAsRead' },
    { name: 'mAsRead',          from: 'TwitterMessageNext', to: 'MarkAsRead' },

]});
