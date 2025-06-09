import { styled } from '@mui/material';

import { StyledFlexAllCenter } from 'shared/styles/styledComponents';
import theme from 'shared/styles/theme';
import { variables } from 'shared/styles/variables';

export const StyledCounter = styled(StyledFlexAllCenter)`
  height: 2rem;
  width: 2.6rem;
  background: ${variables.palette.on_surface_alpha8};
  margin-left: auto;
  margin-right: ${theme.spacing(1.6)};
  border-radius: ${variables.borderRadius.xxxl2};
`;
