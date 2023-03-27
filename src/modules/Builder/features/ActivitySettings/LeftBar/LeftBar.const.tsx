import { Svg } from 'shared/components';

import { ActivitySettingsOptions } from '../ActivitySettings.const';

export const items = [
  {
    groupName: 'reports',
    groupItems: [
      {
        icon: <Svg id="scores-and-reports" />,
        name: ActivitySettingsOptions.ScoresAndReports,
      },
    ],
  },
  {
    groupName: 'subscales',
    groupItems: [
      {
        icon: <Svg id="grid-outlined" />,
        name: ActivitySettingsOptions.SubscalesConfiguration,
      },
    ],
  },
];
