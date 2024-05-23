import { BoxProps } from '@mui/material';
import { Icons } from 'svgSprite';

export interface StatProps extends BoxProps {
  label?: React.ReactNode;
  icon: Icons;
  value?: React.ReactNode;
}

export interface QuickStatsProps extends BoxProps {
  stats?: StatProps[];
}
