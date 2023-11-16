import { variables, StyledLabelBoldMedium } from 'shared/styles';

import { StyledCounter } from './Counter.styles';
import { CounterProps } from './Counter.types';

export const Counter = ({ count }: CounterProps) => (
  <StyledCounter>
    <StyledLabelBoldMedium color={variables.palette.on_surface_variant}>
      {count}
    </StyledLabelBoldMedium>
  </StyledCounter>
);
