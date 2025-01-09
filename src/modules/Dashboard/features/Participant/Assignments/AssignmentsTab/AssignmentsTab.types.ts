import { PropsWithChildren } from 'react';

import { SubjectDetails } from 'modules/Dashboard/types';
import { ParticipantActivityOrFlow } from 'modules/Dashboard/api';

export type AssignmentsTabProps = PropsWithChildren<{
  isLoadingMetadata: boolean;
  aboutParticipantCount?: number;
  byParticipantCount?: number;
}>;

export type UseAssignmentsTabProps = {
  appletId?: string;
  targetSubject?: SubjectDetails;
  respondentSubject?: SubjectDetails;
  handleRefetch?: () => void;
  dataTestId: string;
};

export type GetActionsMenuParams = {
  activityOrFlow: ParticipantActivityOrFlow;
  targetSubject?: SubjectDetails;
  teamMemberCanViewData?: boolean;
};
