import { ChipOwnProps } from '@mui/material';

export enum ChipShape {
  Rectangular = 'rectangular',
  Rounded = 'rounded',
}

export interface ChipProps extends ChipOwnProps {
  ['data-testid']?: string;
  canRemove?: boolean;
  onClick?: () => void;
  onRemove?: () => void;
  shape?: ChipShape;
  title: string | JSX.Element;
}
