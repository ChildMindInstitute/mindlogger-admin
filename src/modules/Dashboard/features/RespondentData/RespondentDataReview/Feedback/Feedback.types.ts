import { DatavizActivity } from 'api';

export type FeedbackProps = {
  onClose: () => void;
  selectedActivity: DatavizActivity;
  isAssessmentVisible: boolean;
};
