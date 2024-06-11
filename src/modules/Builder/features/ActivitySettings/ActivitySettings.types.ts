import { ReactNode } from 'react';

import { ActivityFormValues } from 'modules/Builder/types';

export type ActivitySettingsOptions = {
  name: string;
  title: string | JSX.Element;
  component: ReactNode;
  icon: ReactNode;
  path: string;
};

export type GetActivitySettings = {
  activityFieldName?: string;
  activity?: ActivityFormValues;
  settingsErrors: { hasActivityReportsErrors: boolean; hasActivitySubscalesErrors: boolean };
  appletId?: string;
};
