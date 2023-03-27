import { Svg } from 'shared/components';

import { ActivitySettings } from '../BuilderAppletSettings.const';

export const items = [
  {
    groupName: 'reports',
    groupItems: [
      {
        icon: <Svg id="scores-and-reports" />,
        name: ActivitySettings.ScoresAndReports,
      },
    ],
  },
  {
    groupName: 'subscales',
    groupItems: [
      {
        icon: <Svg id="grid-outlined" />,
        name: ActivitySettings.SubscalesConfiguration,
      },
    ],
  },
];
