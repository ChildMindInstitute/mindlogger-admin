import { PropsWithChildren } from 'react';

import { RespondentDetails } from 'modules/Dashboard/types';

export type AssignmentsTabProps = PropsWithChildren<{
  respondentSubject?: RespondentDetails;
  targetSubject?: RespondentDetails;
  'data-testid': string;
}>;

export type UseAssignmentsTabProps = {
  appletId?: string;
  targetSubject?: RespondentDetails;
  respondentSubject?: RespondentDetails;
  handleRefetch?: () => void;
  dataTestId: string;
};
