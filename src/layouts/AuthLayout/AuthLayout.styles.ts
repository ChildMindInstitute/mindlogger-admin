import { styled } from '@mui/system';
import { Box } from '@mui/material';

import theme from 'styles/theme';
import { variables } from 'styles/variables';
import { StyledFlexAllCenter } from 'styles/styledComponents/Flex';

export const StyledAuthLayout = styled(Box)`
  height: 100vh;
  margin: 0;
  display: flex;
  flex-direction: column;
  overflow: auto;
`;

export const StyledSpinner = styled(Box)`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgb(255 255 255 / 50%);
  z-index: 3;
`;

export const StyledHeader = styled(StyledFlexAllCenter)`
  position: sticky;
  top: 0;
  background-color: ${variables.palette.primary};
  padding: ${theme.spacing(1, 2.4)};
  z-index: 2;
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
  width: 37.6rem;
  margin: ${theme.spacing(2.4, 0)};
`;
