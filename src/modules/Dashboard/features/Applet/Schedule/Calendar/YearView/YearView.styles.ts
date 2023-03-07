import { styled } from '@mui/material';

import { variables } from 'shared/styles/variables';
import theme from 'shared/styles/theme';
import { StyledFlexWrap } from 'shared/styles/styledComponents';

export const StyledYear = styled(StyledFlexWrap)`
  justify-content: space-between;
  border-top: ${variables.borderWidth.md} solid ${variables.palette.surface_variant};
  padding-top: ${theme.spacing(2.6)};
  overflow: auto;
`;
