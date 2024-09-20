import { DrawerProps } from '@mui/material';

import { AssignedActivity, HydratedAssignment } from 'api';
import { AssignedHydratedActivityFlow } from 'modules/Dashboard/types';

const ParticipantContext = ['respondent', 'target'] as const;
export type ParticipantContext = (typeof ParticipantContext)[number];

export type ActivityUnassignDrawerProps = Pick<DrawerProps, 'open'> & {
  onClose: (shouldRefetch?: boolean) => void;
  appletId?: string;
  activityOrFlow?: AssignedActivity | AssignedHydratedActivityFlow;
  /**
   * Whether initiating Unassign from the context of the participant being the respondent or the
   * the target subject.
   */
  participantContext: ParticipantContext;
};

export type ActivityUnassignFormValues = {
  selectedAssignments: HydratedAssignment[];
};

export type GetConfirmationBodyProps = {
  selected: HydratedAssignment[];
  participantContext: ParticipantContext;
};
