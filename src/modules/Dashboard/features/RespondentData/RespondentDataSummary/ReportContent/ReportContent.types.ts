import { DatavizActivity } from 'modules/Dashboard/api';

export type ReportContentProps = {
  selectedActivity: DatavizActivity | null;
  isLoading: boolean;
};
