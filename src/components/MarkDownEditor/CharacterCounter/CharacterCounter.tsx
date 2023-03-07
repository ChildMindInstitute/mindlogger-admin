import React, { FC } from 'react';

import { StyledTitleSmall } from 'styles/styledComponents';
import theme from 'styles/theme';

import { THRESHOLD_SIZE } from '../MarkDownEditor';
import { CharacterCounterProps } from './CharacterCounter.types';

const CharacterCounter: FC<CharacterCounterProps> = ({ inputSize }) => {
  const counter = `${inputSize}/${THRESHOLD_SIZE}`;

  return <StyledTitleSmall sx={{ m: theme.spacing(0, 1) }}>{counter}</StyledTitleSmall>;
};

export { CharacterCounter };
