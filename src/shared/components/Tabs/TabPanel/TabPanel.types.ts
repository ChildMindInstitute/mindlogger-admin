import { BoxProps } from '@mui/material';

export interface TabPanelProps extends BoxProps {
  hiddenHeader?: boolean;
  index: number;
  isMinHeightAuto?: boolean;
  value: number;
}
