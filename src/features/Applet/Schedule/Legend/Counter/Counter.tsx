import { StyledLabelMedium } from 'styles/styledComponents/Typography';

import { StyledCounter } from './Counter.styles';
import { CounterProps } from './Counter.types';

export const Counter = ({ count }: CounterProps) => (
  <StyledCounter>
    <StyledLabelMedium>{count}</StyledLabelMedium>
  </StyledCounter>
);
