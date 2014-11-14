var getMessageFsm = StateMachine.create({
  events: [
    { name: 'getMessage',      from: 'none',            to: 'RecordMessage' },
    { name: 'next',            from: 'RecordMessage',        to: 'ConvertMessage' },
    { name: 'simpleClick',     from: 'RecordMessage',        to: 'StopRecordMessage' },
    { name: 'next',            from: 'StopRecordMessage',    to: 'ConvertMessage' },
    { name: 'retry',           from: 'ConvertMessage',          to: 'RecordMessage' },
    { name: 'simpleClick',     from: 'ConvertMessage',          to: 'Accept' },
    { name: 'stop',            from: 'none',    to: 'Cancel' },
    { name: 'stop',            from: 'Cancel',    to: 'End' },
    { name: 'stop',            from: 'RecordMessage',    to: 'Cancel' },
    { name: 'stop',            from: 'StopRecordMessage',    to: 'Cancel' },
    { name: 'stop',            from: 'ConvertMessage',    to: 'Cancel' },
    { name: 'stop',            from: 'Accept',    to: 'none' },
]});
