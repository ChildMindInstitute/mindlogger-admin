import { DrawerProps } from '@mui/material';

export type ActivityAssignDrawerProps = Pick<DrawerProps, 'open'> & {
  onClose: () => void;
  appletId?: string;
  activityId?: string;
  activityFlowId?: string;
  /** User ID */
  respondentSubjectId?: string | null;
  targetSubjectId?: string | null;
};

export type ActivityAssignment = {
  respondentSubjectId?: string | null;
  targetSubjectId?: string | null;
};

export type ActivityAssignFormValues = {
  activityIds: string[];
  flowIds: string[];
  assignments: ActivityAssignment[];
};
