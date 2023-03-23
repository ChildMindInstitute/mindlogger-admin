import { TimerType } from 'modules/Dashboard/api';
import { createArray } from 'shared/utils';

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

const IDLE_TIME_ITEMS_QUANTITY = 59;

export const idleTimeOptions = createArray(IDLE_TIME_ITEMS_QUANTITY, (index: number) => {
  const minutes = index + 1;
  const optionItem = `00:${index < 9 ? `0${minutes}` : minutes}`;

  return { value: optionItem, labelKey: optionItem };
});
