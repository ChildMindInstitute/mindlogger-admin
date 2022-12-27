import { Availability } from './Availability';
import { ControlType } from './CreateActivityPopup.types';

export const tabs = (control: ControlType) => [
  {
    labelKey: 'availability',
    content: <Availability control={control} />,
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
