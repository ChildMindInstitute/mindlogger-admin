import { ReactNode, FC } from 'react';
import { SxProps } from '@mui/material';

export type HeaderProps = {
  isSticky: boolean;
  children: ReactNode;
  headerProps?: Record<string, unknown>;
};

export type BuilderContainerProps = {
  title: string;
  Header?: FC<HeaderProps>;
  headerProps?: Record<string, unknown>;
  children?: ReactNode;
  sxProps?: SxProps;
  contentSxProps?: SxProps;
  hasMaxWidth?: boolean;
  contentClassName?: string;
  'data-testid'?: string;
};
