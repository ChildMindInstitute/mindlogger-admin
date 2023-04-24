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

export const DEFAULT_TIMER_DURATION = '01:00';

export const DEFAULT_IDLE_TIME = '00:01';

export const SECONDS_TO_MILLISECONDS_MULTIPLIER = 1000;
