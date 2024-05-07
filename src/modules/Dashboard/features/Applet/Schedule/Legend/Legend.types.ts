import { BoxProps } from '@mui/material';

import { PreparedEvents } from '../Schedule.types';

export interface LegendProps extends BoxProps {
  appletId: string;
  appletName: string;
  canCreateIndividualSchedule?: boolean;
  hasIndividualSchedule?: boolean;
  legendEvents: PreparedEvents | null;
  showScheduleToggle?: boolean;
  userId?: string;
}

export type SelectedRespondent = {
  id: string;
  icon: JSX.Element | null;
  secretId: string;
  nickname: string | null;
  hasIndividualSchedule: boolean;
} | null;
