var soundFsm = StateMachine.create({
  events: [
    { name: 'sound',      from: 'none',          to: 'RecordSound' },
    { name: 'sound',      from: 'End',           to: 'RecordSound' },
    { name: 'noToken',      from: 'none',          to: 'NoToken' },
    { name: 'next',      from: 'NoToken',          to: 'End' },
    { name: 'simpleClick',      from: 'RecordSound',        to: 'StopRecordSound' },
    { name: 'next',             from: 'RecordSound',        to: 'PostSound' },
    { name: 'next',             from: 'StopRecordSound',    to: 'PostSound' },
    { name: 'next',             from: 'PostSound',          to: 'End' },
    
    { name: 'stop',             from: 'none',        to: 'End' },
    { name: 'stop',             from: 'RecordSound',        to: 'End' },
    { name: 'stop',             from: 'StopRecordSound',    to: 'End' },
    { name: 'stop',             from: 'PostSound',          to: 'End' },
    
]});
