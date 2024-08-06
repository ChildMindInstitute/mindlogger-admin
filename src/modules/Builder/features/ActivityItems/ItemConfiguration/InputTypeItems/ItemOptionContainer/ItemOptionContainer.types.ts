import { SxProps } from '@mui/material';
import { ReactNode } from 'react';

export type ItemOptionContainerProps = {
  sx?: SxProps;
  title?: string;
  description?: string;
  children: ReactNode;
  'data-testid'?: string;
};
