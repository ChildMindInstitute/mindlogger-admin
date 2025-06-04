import { Box, styled } from '@mui/material';

import { StyledFlexAllCenter, StyledFlexColumn } from 'shared/styles/styledComponents';
import theme from 'shared/styles/theme';
import { variables } from 'shared/styles/variables';

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

export const StyledLogo = styled('img')`
  width: 148px;
  height: 32px;
  display: block;
  margin: ${theme.spacing(0.6, 0)};
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
