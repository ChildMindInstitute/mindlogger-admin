import { PropsWithChildren } from 'react';

import { SubjectDetails } from 'modules/Dashboard/types';

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
