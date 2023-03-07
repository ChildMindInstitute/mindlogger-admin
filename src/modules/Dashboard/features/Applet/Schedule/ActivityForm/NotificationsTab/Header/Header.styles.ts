import { styled } from '@mui/system';

import theme from 'shared/styles/theme';
import { StyledClearedButton, StyledFlexTopCenter } from 'shared/styles/styledComponents';
import { variables } from 'shared/styles/variables';

export const StyledHeader = styled(StyledFlexTopCenter)`
  justify-content: space-between;
  margin-bottom: ${theme.spacing(3.5)};
`;

export const StyledCloseBtn = styled(StyledClearedButton)`
  svg {
    fill: ${variables.palette.on_surface_variant};
  }
`;
