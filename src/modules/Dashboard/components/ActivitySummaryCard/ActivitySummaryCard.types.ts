import { ReactNode } from 'react';

import { Activity } from 'redux/modules';

export type ActivitySummaryCardProps = Pick<Activity, 'name' | 'image'> & {
  activityId?: string;
  actionsMenu: ReactNode;
  compliance?: ReactNode;
  participantCount?: ReactNode;
  latestActivity?: ReactNode;
  'data-testid'?: string;
  onClick?: (activityId: string) => void;
};
