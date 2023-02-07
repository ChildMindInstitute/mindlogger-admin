import { styled } from '@mui/material';

import { variables } from 'styles/variables';
import theme from 'styles/theme';
import { StyledFlexWrap } from 'styles/styledComponents/Flex';

export const StyledYear = styled(StyledFlexWrap)`
  justify-content: space-between;
  border-top: ${variables.borderWidth.md} solid ${variables.palette.surface_variant};
  padding-top: ${theme.spacing(2.6)};
  overflow: auto;
`;
