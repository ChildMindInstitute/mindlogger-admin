import { Svg } from 'components';

import { PinProps } from './Pin.types';
import { StyledPinButton } from './Pin.styles';

export const Pin = ({
  isPinned = false,
  onClick,
}: PinProps & React.HTMLProps<HTMLButtonElement>) => (
  <StyledPinButton isPinned={isPinned} onClick={onClick}>
    <Svg id="pin-outlined" />
  </StyledPinButton>
);
