import { ReactElement } from 'react';

import { SxProps } from '@mui/material';

export enum ChipShape {
  Rectangular = 'rectangular',
  Rounded = 'rounded',
}

export type ChipProps = {
  title: string | JSX.Element;
  onRemove?: () => void;
  color?: 'primary' | 'secondary' | 'error';
  shape?: ChipShape;
  icon?: ReactElement | undefined;
  canRemove?: boolean;
  onClick?: () => void;
  sxProps?: SxProps;
  'data-testid'?: string;
};
