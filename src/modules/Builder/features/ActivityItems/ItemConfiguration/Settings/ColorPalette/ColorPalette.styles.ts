import { Collapse, styled } from '@mui/material';

import { theme, variables } from 'shared/styles';

export const StyledColorPaletteContainer = styled(Collapse)`
  background: ${variables.palette.surface1};
  padding: ${theme.spacing(2.4)};
  border-radius: ${variables.borderRadius.lg2};
  margin-bottom: ${theme.spacing(2)};

  .MuiCollapse-wrapper {
    height: 100%;
  }
`;
