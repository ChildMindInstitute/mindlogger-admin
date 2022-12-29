import { Availability } from './Availability';

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
    content: <>notifications</>,
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
};
