import { styled } from '@mui/material';

import { variables, StyledBodyLarge, StyledFlexTopCenter } from 'shared/styles';
import { shouldForwardProp } from 'shared/utils';

export const StyledPlaceholder = styled(StyledBodyLarge)`
  position: absolute;
  left: 1.65rem;
  top: 1.4rem;
  color: ${variables.palette.outline};
`;

export const StyledItem = styled(StyledFlexTopCenter, shouldForwardProp)`
  ${({ disabled }: { disabled: boolean }) =>
    disabled &&
    `
    pointer-events: none;
    opacity: 0.38;
  `}
`;
