import { Activity } from '../RespondentDataReview.types';

export type FeedbackProps = {
  onClose: () => void;
  selectedActivity: Activity;
};
