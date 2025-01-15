import { ParticipantActivityOrFlow, TargetSubjectsByRespondent } from 'api';
import { SubjectDetails } from 'modules/Dashboard/types';
import { MenuItem } from 'shared/components';

import { GetActionsMenuParams } from '../../AssignmentsTab/AssignmentsTab.types';

export type ExpandedViewProps = {
  activityOrFlow: ParticipantActivityOrFlow;
  targetSubjects?: TargetSubjectsByRespondent;
  getActionsMenu: (params: GetActionsMenuParams) => MenuItem<unknown>[];
  onClickViewData: (
    activityOrFlow: ParticipantActivityOrFlow,
    targetSubject: SubjectDetails,
  ) => void;
  'data-testid': string;
};

export type ExpandedViewHandle = {
  refetch: () => void;
};
