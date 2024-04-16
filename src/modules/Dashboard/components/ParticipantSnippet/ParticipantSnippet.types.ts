import { BoxProps } from '@mui/material';
import { ElementType } from 'react';

export type ParticipantSnippetProps<T extends ElementType> = {
  secretId?: string | null;
  nickname?: string | null;
  tag?: string | null;
  boxProps?: BoxProps<T>;
  'data-testid'?: string;
};
