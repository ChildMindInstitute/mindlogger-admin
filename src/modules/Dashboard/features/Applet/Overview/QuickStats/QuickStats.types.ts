import { BoxProps } from '@mui/material';

export interface StatProps extends BoxProps {
  label?: React.ReactNode;
  tooltip?: string;
  value?: React.ReactNode;
}

export interface QuickStatsProps extends BoxProps {
  stats?: StatProps[];
}
