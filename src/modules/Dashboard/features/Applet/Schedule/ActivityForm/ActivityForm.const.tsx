import { TimerType, Periodicity } from 'modules/Dashboard/api';

import { AvailabilityTab } from './AvailabilityTab';
import { NotificationsTab } from './NotificationsTab';
import { TimersTab } from './TimersTab';

export const tabs = [
  {
    labelKey: 'availability',
    content: <AvailabilityTab />,
  },
  {
    labelKey: 'timers',
    content: <TimersTab />,
  },
  {
    labelKey: 'notifications',
    content: <NotificationsTab />,
  },
];

export const DEFAULT_START_TIME = '00:00';
export const DEFAULT_END_TIME = '23:59';

const DEFAULT_TIMER_DURATION = '01:00';

const DEFAULT_IDLE_TIME = '00:01';

export const getDefaultValues = (defaultStartDate?: Date) => ({
  activityOrFlowId: '',
  alwaysAvailable: true,
  oneTimeCompletion: false,
  startTime: DEFAULT_START_TIME,
  endTime: DEFAULT_END_TIME,
  date: defaultStartDate || '',
  startEndingDate: defaultStartDate ? [defaultStartDate, null] : '',
  accessBeforeSchedule: false,
  timerType: TimerType.NotSet,
  timerDuration: DEFAULT_TIMER_DURATION,
  idleTime: DEFAULT_IDLE_TIME,
  periodicity: Periodicity.Once,
  defaultStartDate,
  notifications: [],
  reminder: null,
});
