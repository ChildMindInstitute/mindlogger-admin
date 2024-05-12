import { ElementType } from 'react';
import { BoxProps } from '@mui/material';

import { ParticipantTag } from 'shared/consts';

export type ParticipantSnippetInfo = {
  secretId?: string | null;
  nickname?: string | null;
  tag?: ParticipantTag | null;
};

export type ParticipantSnippetProps<T extends ElementType> = ParticipantSnippetInfo & {
  boxProps?: BoxProps<T>;
  'data-testid'?: string;
};
