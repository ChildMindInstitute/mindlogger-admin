export const enum Timers {
  noTimeLimit = 'No time limit',
  timer = 'Timer',
  idleTime = 'Idle time',
}

export const timersButtons = [
  {
    value: Timers.noTimeLimit,
    label: 'noTimeLimit',
  },
  {
    value: Timers.timer,
    label: 'timer',
  },
  {
    value: Timers.idleTime,
    label: 'idleTime',
  },
];
