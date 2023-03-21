import { THRESHOLD_SIZE } from 'shared/components/MarkDownEditor/MarkDownEditor';
import { StyledTitleSmall } from 'shared/styles/styledComponents';
import theme from 'shared/styles/theme';

import { CharacterCounterProps } from './CharacterCounter.types';

export const CharacterCounter = ({ inputSize }: CharacterCounterProps) => {
  const counter = `${inputSize}/${THRESHOLD_SIZE}`;

  return <StyledTitleSmall sx={{ m: theme.spacing(0, 1) }}>{counter}</StyledTitleSmall>;
};
