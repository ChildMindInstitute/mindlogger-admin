import { BoxProps } from '@mui/material';

export interface ParticipantActivitiesToolbarProps extends BoxProps {
  appletId: string;
  onClickAssign: () => void;
  'data-testid': string;
}
