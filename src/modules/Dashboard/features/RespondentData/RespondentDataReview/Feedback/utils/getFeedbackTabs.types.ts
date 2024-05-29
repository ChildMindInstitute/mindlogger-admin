import { AssessmentActivityItem } from '../../RespondentDataReview.types';
import { SelectedEntity } from '../Feedback.types';

export type GetFeedbackTabs = {
  selectedEntity: SelectedEntity;
  assessment: AssessmentActivityItem[] | undefined;
};
