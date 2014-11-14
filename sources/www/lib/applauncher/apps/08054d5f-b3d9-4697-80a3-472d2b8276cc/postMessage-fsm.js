var postMessageFsm = StateMachine.create({
  events: [
    { name: 'postMessage',      from: 'none',           to: 'PostMessage' },
    { name: 'postMessage',      from: 'End',        to: 'PostMessage' },
    { name: 'error',            from: 'PostMessage',    to: 'End' },
    { name: 'stop',             from: 'none',    to: 'End' },
    { name: 'stop',             from: 'PostMessage',    to: 'End' },
]});
