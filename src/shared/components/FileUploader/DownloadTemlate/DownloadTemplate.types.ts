import { ReactNode } from 'react';
import { SxProps } from '@mui/material';

export type DownloadTemplateProps = {
  children: ReactNode;
  onClick: () => void;
  sxProps?: SxProps;
};
