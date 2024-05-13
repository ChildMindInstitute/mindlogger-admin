import { ElementType, ReactNode } from 'react';
import { BoxProps } from '@mui/material';

import { ParticipantTag } from 'shared/consts';

export type ParticipantSnippetInfo = {
  secretId?: string | null;
  nickname?: string | null;
  tag?: ParticipantTag | null;
};

export enum ParticipantSnippetVariant {
  Default = 'Default',
  Large = 'Large',
}

export type ParticipantSnippetProps<T extends ElementType> = ParticipantSnippetInfo & {
  boxProps?: BoxProps<T>;
  rightContent?: ReactNode;
  variant?: ParticipantSnippetVariant;
  'data-testid'?: string;
};
