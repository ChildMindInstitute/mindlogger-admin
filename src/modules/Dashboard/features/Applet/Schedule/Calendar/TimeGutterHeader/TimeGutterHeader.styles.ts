import { styled } from '@mui/material';

import { StyledFlexTopCenter } from 'shared/styles/styledComponents';
import { variables } from 'shared/styles/variables';

export const StyledTimeGutterHeader = styled(StyledFlexTopCenter)`
  svg {
    flex-shrink: 0;
    fill: ${variables.palette.on_surface_variant};
  }
`;
