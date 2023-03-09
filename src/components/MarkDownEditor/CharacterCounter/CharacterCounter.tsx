import { THRESHOLD_SIZE } from 'components';
import { StyledTitleSmall } from 'styles/styledComponents';
import theme from 'styles/theme';

import { CharacterCounterProps } from './CharacterCounter.types';

export const CharacterCounter = ({ inputSize }: CharacterCounterProps) => {
  const counter = `${inputSize}/${THRESHOLD_SIZE}`;

  return <StyledTitleSmall sx={{ m: theme.spacing(0, 1) }}>{counter}</StyledTitleSmall>;
};
