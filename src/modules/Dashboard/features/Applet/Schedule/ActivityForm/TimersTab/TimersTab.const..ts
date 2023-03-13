export const enum Timers {
  NoTimeLimit = 'No time limit',
  Timer = 'Timer',
  IdleTime = 'Idle time',
}

export const timersButtons = [
  {
    value: Timers.NoTimeLimit,
    label: 'noTimeLimit',
  },
  {
    value: Timers.Timer,
    label: 'timer',
  },
  {
    value: Timers.IdleTime,
    label: 'idleTime',
  },
];
