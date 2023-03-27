import { PreparedEvents } from '../Schedule.types';

export type LegendProps = {
  legendEvents: PreparedEvents | null;
};

export type SelectedRespondent = {
  id: string;
  fullName: string;
  icon: JSX.Element;
} | null;
