import { ElementType } from 'react';
import { BoxProps } from '@mui/material';

export type ParticipantSnippetInfo = {
  secretId?: string | null;
  nickname?: string | null;
  tag?: string | null;
};

export type ParticipantSnippetProps<T extends ElementType> = ParticipantSnippetInfo & {
  boxProps?: BoxProps<T>;
  'data-testid'?: string;
};
