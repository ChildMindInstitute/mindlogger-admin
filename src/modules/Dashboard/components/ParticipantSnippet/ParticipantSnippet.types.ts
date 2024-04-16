import { BoxProps } from '@mui/material';
import { ElementType } from 'react';
import { BoxTypeMap } from '@mui/system';

export type ParticipantSnippetProps<T extends ElementType = BoxTypeMap['defaultComponent']> = {
  secretId?: string | null;
  nickname?: string | null;
  tag?: string | null;
  boxProps?: BoxProps<T>;
  'data-testid'?: string;
};
