import { styled } from '@mui/material';

import { variables } from 'shared/styles/variables';
import { StyledFlexTopCenter } from 'shared/styles/styledComponents';

export const StyledTimeGutterHeader = styled(StyledFlexTopCenter)`
  svg {
    flex-shrink: 0;
    fill: ${variables.palette.on_surface_variant};
  }
`;
