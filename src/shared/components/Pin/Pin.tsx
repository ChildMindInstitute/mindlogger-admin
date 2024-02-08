import { Svg } from 'shared/components/Svg';

import { StyledPinButton } from './Pin.styles';
import { PinProps } from './Pin.types';

export const Pin = ({
  isPinned = false,
  'data-testid': dataTestId,
  onClick,
}: PinProps & React.HTMLProps<HTMLButtonElement>) => (
  <StyledPinButton isPinned={isPinned} onClick={onClick} data-testid={dataTestId}>
    <Svg id="pin-outlined" />
  </StyledPinButton>
);
