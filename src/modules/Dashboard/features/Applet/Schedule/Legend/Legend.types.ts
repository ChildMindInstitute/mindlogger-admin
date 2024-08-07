import { BoxProps } from '@mui/material';

import { PreparedEvents } from '../Schedule.types';

export interface LegendProps extends BoxProps {
  legendEvents: PreparedEvents | null;
  showScheduleToggle?: boolean;
}

export type SelectedRespondent = {
  id: string;
  icon: JSX.Element | null;
  secretId: string;
  nickname: string | null;
  hasIndividualSchedule: boolean;
} | null;
