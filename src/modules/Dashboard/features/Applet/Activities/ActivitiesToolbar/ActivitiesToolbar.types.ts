import { BoxProps } from '@mui/material';

export interface ActivitiesToolbarProps extends BoxProps {
  appletId?: string;
  onClickAssign: () => void;
  'data-testid': string;
}
