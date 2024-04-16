import React from 'react';
import { BoxProps } from '@mui/material/Box/Box';

export type ParticipantSnippetProps<T extends React.ElementType> = {
  secretId: string;
  nickname?: string | null;
  tag?: string | null;
  boxProps?: BoxProps<T>;
};
