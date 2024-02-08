import { styled } from '@mui/material';

import { commonEllipsisStyles, StyledBodyLarge, StyledClearedButton, variables } from 'shared/styles';

export const StyledValue = styled(StyledBodyLarge)`
  ${commonEllipsisStyles};
`;

export const StyledDuplicateButton = styled(StyledClearedButton)`
  svg {
    fill: ${variables.palette.primary};
  }
`;
