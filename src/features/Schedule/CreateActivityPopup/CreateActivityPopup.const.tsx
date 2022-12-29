import { Availability } from './Availability';
import { NotificationsTab } from './NotificationsTab';

export const tabs = [
  {
    labelKey: 'availability',
    content: <Availability />,
  },
  {
    labelKey: 'timers',
    content: <>timers</>,
  },
  {
    labelKey: 'notifications',
    content: <NotificationsTab />,
  },
];

export const activities = [
  {
    value: 'a',
    labelKey: 'A',
  },
];

export const defaultValues = {
  activity: activities[0].value,
  availability: true,
  completion: false,
  from: '',
  to: '',
  date: '',
  startEndingDate: '',
  timeout: {
    access: false,
  },
  notifications: [],
  reminder: null,
};
