import { PropsWithChildren } from 'react';

import { SubjectDetailsWithRoles } from 'modules/Dashboard/types';
import { ParticipantActivityOrFlow } from 'modules/Dashboard/api';

export type AssignmentsTabProps = PropsWithChildren<{
  isLoadingMetadata: boolean;
  aboutParticipantCount?: number;
  byParticipantCount?: number;
}>;

export type UseAssignmentsTabProps = {
  appletId?: string;
  targetSubject?: SubjectDetailsWithRoles;
  respondentSubject?: SubjectDetailsWithRoles;
  handleRefetch?: () => void;
  dataTestId: string;
};

export type GetActionsMenuParams = {
  activityOrFlow: ParticipantActivityOrFlow;
  targetSubject?: SubjectDetailsWithRoles;
  teamMemberCanViewData?: boolean;
};
