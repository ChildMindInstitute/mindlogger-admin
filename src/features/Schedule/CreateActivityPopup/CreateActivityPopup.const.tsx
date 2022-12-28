import { Availability } from './Availability';

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
    content: <>3</>,
  },
];

export const defaultValues = {
  activity: '',
  availability: true,
  completion: false,
  from: '',
  to: '',
  timeout: {
    access: false,
  },
};
