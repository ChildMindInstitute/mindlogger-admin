import { Availability } from './Availability';
import { NotificationsTab } from './NotificationsTab';

export const tabs = [
  {
    labelKey: 'availability',
    content: <Availability />,
  },
  {
    labelKey: 'timers',
    content: <>2</>,
  },
  {
    labelKey: 'notifications',
    content: <NotificationsTab />,
  },
];
