import { ParticipantActivityOrFlow, TargetSubjectsByRespondent } from 'api';
import { RespondentDetails } from 'modules/Dashboard/types';
import { MenuItem } from 'shared/components';

export type ExpandedViewProps = {
  activityOrFlow: ParticipantActivityOrFlow;
  targetSubjects?: TargetSubjectsByRespondent;
  getActionsMenu: (
    activityOrFlow: ParticipantActivityOrFlow,
    targetSubjectArg?: RespondentDetails,
  ) => MenuItem<unknown>[];
  onClickViewData: (
    activityOrFlow: ParticipantActivityOrFlow,
    targetSubject: RespondentDetails,
  ) => void;
  'data-test-id': string;
};

export type ExpandedViewHandle = {
  refetch: () => void;
};
