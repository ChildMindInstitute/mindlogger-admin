import { PreparedEvents } from '../Schedule.types';

export type LegendProps = {
  legendEvents: PreparedEvents | null;
  appletName: string;
  appletId: string;
};

export type SelectedRespondent = {
  id: string;
  icon: JSX.Element | null;
  secretId: string;
  nickname: string | null;
  hasIndividualSchedule: boolean;
} | null;
