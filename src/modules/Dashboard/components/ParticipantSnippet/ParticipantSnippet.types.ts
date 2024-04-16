import { ElementType } from 'react';
import { BoxProps } from '@mui/material/Box/Box';

export type ParticipantSnippetProps<T extends ElementType> = {
  secretId: string;
  nickname?: string | null;
  tag?: string | null;
  'data-testid'?: string;
  boxProps?: BoxProps<T>;
};
