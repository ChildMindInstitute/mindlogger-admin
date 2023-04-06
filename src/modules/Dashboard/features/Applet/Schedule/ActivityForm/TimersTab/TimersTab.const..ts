import { TimerType } from 'modules/Dashboard/api';

export const timersButtons = [
  {
    value: TimerType.NotSet,
    label: 'noTimeLimit',
  },
  {
    value: TimerType.Timer,
    label: 'timer',
  },
  {
    value: TimerType.Idle,
    label: 'idleTime',
  },
];
