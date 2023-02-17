import { styled } from '@mui/system';

import theme from 'styles/theme';
import { StyledClearedButton, StyledFlexTopCenter } from 'styles/styledComponents';
import { variables } from 'styles/variables';

export const StyledHeader = styled(StyledFlexTopCenter)`
  justify-content: space-between;
  margin-bottom: ${theme.spacing(3.5)};
`;

export const StyledCloseBtn = styled(StyledClearedButton)`
  svg {
    fill: ${variables.palette.on_surface_variant};
  }
`;
