import { ParticipantActivityOrFlow, TargetSubjectsByRespondent } from 'api';
import { RespondentDetails } from 'modules/Dashboard/types';

export type ExpandedViewProps = {
  activityOrFlow: ParticipantActivityOrFlow;
  respondentSubject: RespondentDetails;
  targetSubjects?: TargetSubjectsByRespondent;
  isLoading: boolean;
  onClickViewData: (
    activityOrFlow: ParticipantActivityOrFlow,
    targetSubject: RespondentDetails,
  ) => void;
  'data-test-id': string;
};

export type ExpandedViewHandle = {
  refetch: () => void;
};
