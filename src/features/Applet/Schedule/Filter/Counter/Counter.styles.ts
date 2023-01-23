import { styled } from '@mui/system';

import theme from 'styles/theme';
import { variables } from 'styles/variables';
import { StyledFlexAllCenter } from 'styles/styledComponents/Flex';

export const StyledCounter = styled(StyledFlexAllCenter)`
  height: 2rem;
  width: 2.6rem;
  background: ${variables.palette.on_surface_alfa8};
  margin-left: auto;
  margin-right: ${theme.spacing(1.6)};
  border-radius: ${variables.borderRadius.xxxl2};
`;
