import { Svg } from 'shared/components/Svg';

import { PinProps } from './Pin.types';
import { StyledPinButton } from './Pin.styles';

export const Pin = ({
  isPinned = false,
  'data-testid': dataTestId,
  onClick,
}: PinProps & React.HTMLProps<HTMLButtonElement>) => (
  <StyledPinButton isPinned={isPinned} onClick={onClick} data-testid={dataTestId}>
    <Svg id="pin-outlined" />
  </StyledPinButton>
);
