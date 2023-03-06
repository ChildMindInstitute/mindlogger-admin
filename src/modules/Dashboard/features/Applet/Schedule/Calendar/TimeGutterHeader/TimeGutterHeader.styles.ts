import { styled } from '@mui/material';

import { variables } from 'styles/variables';
import { StyledFlexTopCenter } from 'styles/styledComponents';

export const StyledTimeGutterHeader = styled(StyledFlexTopCenter)`
  svg {
    flex-shrink: 0;
    fill: ${variables.palette.on_surface_variant};
  }
`;
