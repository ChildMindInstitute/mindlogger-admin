import { styled } from '@mui/material';

import { shouldForwardProp } from 'shared/utils';
import { variables, StyledStickyHeader } from 'shared/styles';

export const StyledHeader = styled(StyledStickyHeader, shouldForwardProp)`
  justify-content: space-between;

  svg {
    fill: ${variables.palette.on_surface_variant};
  }
`;
