import { DrawerProps } from '@mui/material';
import { DeepRequired } from 'react-hook-form';

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

export type ValidActivityAssignment = DeepRequired<ActivityAssignment>;

export type ActivityAssignFormValues = {
  activityIds: string[];
  flowIds: string[];
  assignments: ActivityAssignment[];
};
