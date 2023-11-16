import { styled, Box } from '@mui/material';

import theme from 'shared/styles/theme';
import { variables } from 'shared/styles/variables';
import { StyledFlexAllCenter, StyledFlexColumn } from 'shared/styles/styledComponents';

export const StyledAuthLayout = styled(StyledFlexColumn)`
  height: 100vh;
  margin: 0;
  overflow: auto;
`;

export const StyledHeader = styled(Box)`
  position: sticky;
  top: 0;
  z-index: ${theme.zIndex.fab};
`;

export const StyledLogoWrapper = styled(StyledFlexAllCenter)`
  width: 100%;
  background-color: ${variables.palette.primary};
  padding: ${theme.spacing(1, 2.4)};
`;

export const StyledOutlet = styled(Box)`
  display: flex;
  flex: 1;
`;

export const StyledAuthWrapper = styled(StyledFlexAllCenter)`
  height: 100%;
  width: 100%;
`;

export const StyledAuthWrapperInner = styled(Box)`
  margin: ${theme.spacing(2.4, 0)};
`;
