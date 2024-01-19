import { styled } from '@mui/material';

import { variables, StyledClearedButton } from 'shared/styles';

export const StyledCopyButton = styled(StyledClearedButton)`
  width: 2rem;
  height: 2rem;

  svg {
    fill: ${variables.palette.white};
  }

  &:hover {
    svg {
      fill: ${variables.palette.surface5};
    }
  }
`;
