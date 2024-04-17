import { ElementType } from 'react';
import { BoxProps } from '@mui/material/Box/Box';

export type ParticipantSnippetProps<T extends ElementType> = {
  secretId?: string | null;
  nickname?: string | null;
  tag?: string | null;
  boxProps?: BoxProps<T>;
  'data-testid'?: string;
};
