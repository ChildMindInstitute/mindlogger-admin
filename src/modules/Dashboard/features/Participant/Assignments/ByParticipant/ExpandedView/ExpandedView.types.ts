import { ParticipantActivityOrFlow, TargetSubjectsByRespondent } from 'api';
import { SubjectDetails } from 'modules/Dashboard/types';
import { MenuItem } from 'shared/components';

export type ExpandedViewProps = {
  activityOrFlow: ParticipantActivityOrFlow;
  targetSubjects?: TargetSubjectsByRespondent;
  getActionsMenu: (
    activityOrFlow: ParticipantActivityOrFlow,
    targetSubjectArg?: SubjectDetails,
  ) => MenuItem<unknown>[];
  onClickViewData: (
    activityOrFlow: ParticipantActivityOrFlow,
    targetSubject: SubjectDetails,
  ) => void;
  'data-test-id': string;
};

export type ExpandedViewHandle = {
  refetch: () => void;
};
