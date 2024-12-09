import { PropsWithChildren } from 'react';

import { RespondentDetails } from 'modules/Dashboard/types';

export type AssignmentsTabProps = PropsWithChildren<{
  isLoadingMetadata: boolean;
  aboutParticipantCount?: number;
  byParticipantCount?: number;
}>;

export type UseAssignmentsTabProps = {
  appletId?: string;
  targetSubject?: RespondentDetails;
  respondentSubject?: RespondentDetails;
  handleRefetch?: () => void;
  dataTestId: string;
};
