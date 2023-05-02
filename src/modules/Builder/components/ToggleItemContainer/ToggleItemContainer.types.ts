import { FC } from 'react';
import { SxProps } from '@mui/material';

export type SharedToggleItemProps = {
  open?: boolean;
};
export type ToggleItemProps = {
  title?: string;
  HeaderContent: FC<SharedToggleItemProps & any>;
  Content: FC<SharedToggleItemProps & any>;
  headerContentProps?: Record<string, unknown>;
  contentProps?: Record<string, unknown>;
  headerStyles?: SxProps;
};
