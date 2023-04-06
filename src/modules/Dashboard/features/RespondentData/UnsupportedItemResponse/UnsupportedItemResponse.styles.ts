import { styled } from '@mui/material';

import { StyledFlexTopCenter, theme, variables } from 'shared/styles';

export const StyledItem = styled(StyledFlexTopCenter)`
  svg {
    fill: ${variables.palette.outline};
    margin-right: ${theme.spacing(1.6)};
  }
`;
