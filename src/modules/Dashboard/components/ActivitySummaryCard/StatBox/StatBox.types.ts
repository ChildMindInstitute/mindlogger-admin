import { SxProps, Theme } from '@mui/material';
import { PropsWithChildren } from 'react';

export type StatBoxProps = PropsWithChildren<{
  label: string;
  sx?: SxProps<Theme>;
}>;
