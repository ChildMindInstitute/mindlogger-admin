import { IconButtonProps } from '@mui/material';

export interface ScheduleToggleProps extends IconButtonProps {
  'data-testid'?: string;
  appletId?: string;
  isEmpty?: boolean;
  isIndividual?: boolean;
  userId?: string;
  userName?: string;
}
