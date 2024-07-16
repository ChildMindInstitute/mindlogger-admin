import { ReactNode } from 'react';

import { Activity } from 'redux/modules';

export type ActivitySummaryCardProps = {
  activity: Pick<Activity, 'id' | 'name' | 'image'>;
  actionsMenu: ReactNode;
  compliance?: ReactNode;
  participantCount?: ReactNode;
  latestActivity?: ReactNode;
  showStats?: boolean;
  'data-testid'?: string;
  onClick?: (props: { activityId: string }) => void;
};
