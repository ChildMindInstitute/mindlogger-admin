import { Svg } from 'components/Svg';

import { PinProps } from './Pin.types';
import { StyledPinButton } from './Pin.styles';

export const Pin = ({
  isPinned = false,
  onClick,
}: PinProps & React.HTMLProps<HTMLButtonElement>): JSX.Element => (
  <StyledPinButton isPinned onClick={onClick}>
    <Svg id={isPinned ? 'pin-filled' : 'pin-outlined'} />
  </StyledPinButton>
);
