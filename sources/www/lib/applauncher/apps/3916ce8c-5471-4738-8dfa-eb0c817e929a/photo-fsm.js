var photoFsm = StateMachine.create({
  events: [
    { name: 'photo',      from: 'none',           to: 'Photo' },
    { name: 'next',       from: 'End',           to: 'none' },
    { name: 'error',            from: 'none',    to: 'End' },
    { name: 'error',            from: 'Photo',    to: 'End' },
    { name: 'stop',             from: 'none',    to: 'End' },
    { name: 'stop',             from: 'Photo',    to: 'End' },
]});
