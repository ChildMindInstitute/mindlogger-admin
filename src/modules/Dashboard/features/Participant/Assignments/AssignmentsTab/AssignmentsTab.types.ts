import { PropsWithChildren } from 'react';

import { ParticipantActivityOrFlow } from 'modules/Dashboard/api';
import { SubjectDetailsWithDataAccess } from 'modules/Dashboard/types';

export type AssignmentsTabProps = PropsWithChildren<{
  isLoadingMetadata: boolean;
  aboutParticipantCount?: number;
  byParticipantCount?: number;
}>;

export type UseAssignmentsTabProps = {
  appletId?: string;
  targetSubject?: SubjectDetailsWithDataAccess;
  respondentSubject?: SubjectDetailsWithDataAccess;
  handleRefetch?: () => void;
  dataTestId: string;
};

export type GetActionsMenuParams = {
  activityOrFlow: ParticipantActivityOrFlow;
  targetSubject?: Omit<SubjectDetailsWithDataAccess, 'teamMemberCanViewData'>;
  teamMemberCanViewData?: boolean;
};
