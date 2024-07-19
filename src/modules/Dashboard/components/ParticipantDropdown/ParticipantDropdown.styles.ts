import { styled } from '@mui/material';

import { StyledLabelBoldLarge, theme, variables } from 'shared/styles';

export const StyledGroupLabel = styled(StyledLabelBoldLarge)`
  overflow: hidden;
  text-overflow: ellipsis;
  color: ${variables.palette.on_surface_variant};
  padding: ${theme.spacing(1.6, 1.6, 0.4)};
`;
