import { Icons } from 'svgSprite';
import { ChipOwnProps } from '@mui/material';

import { ActivityAssignmentStatus } from 'api';

export const ActivityStatusColors: Record<ActivityAssignmentStatus, ChipOwnProps['color']> = {
  active: 'success',
  inactive: 'warning',
  hidden: 'warning',
  deleted: 'error',
};

export const ActivityStatusIcons: Record<ActivityAssignmentStatus, Icons> = {
  active: 'check-outlined',
  inactive: 'cross-outlined',
  hidden: 'eye-hidden',
  deleted: 'trash',
};
