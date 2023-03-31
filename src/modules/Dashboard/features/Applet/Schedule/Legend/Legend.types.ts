import { PreparedEvents } from '../Schedule.types';

export type LegendProps = {
  legendEvents: PreparedEvents | null;
  appletName: string;
};

export type SelectedRespondent = {
  id: string;
  fullName: string;
  icon: JSX.Element;
} | null;
