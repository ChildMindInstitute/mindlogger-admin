import { styled } from '@mui/system';
import { Box, Button } from '@mui/material';

import theme from 'styles/theme';
import { variables } from 'styles/variables';

export const StyledAccountPanel = styled(Box)`
  height: 100vh;
  width: 40rem;
  position: fixed;
  top: 0;
  right: 0;
  padding: ${theme.spacing(1.6)};
  background-color: ${variables.palette.primary95};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const StyledHeader = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const StyledHeaderInfo = styled(Box)`
  text-align: right;
  margin-right: ${theme.spacing(1.2)};
`;

export const StyledHideBtn = styled(Button)`
  padding: 0;
  height: auto;
  min-width: unset;
`;

export const StyledHeaderRight = styled(Box)`
  display: flex;
  align-items: center;
`;

export const StyledAvatarWrapper = styled(Box)`
  border-radius: ${variables.borderRadius.half};
  background-color: ${variables.palette.shades40};
  height: 4rem;
  width: 4rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const StyledImage = styled('img')`
  width: 3.2rem;
  height: 3.2rem;
`;

export const StyledFooter = styled(Box)`
  margin: ${theme.spacing(0, 1.6)};
  padding: ${theme.spacing(2.7, 0, 0.8)};
  border-top: ${variables.borderWidth.md} solid ${variables.palette.shades70};
`;

export const StyledLogOutBtn = styled(Button)`
  padding: ${theme.spacing(0.8, 0.4)};
  border-radius: ${variables.borderRadius.lg};
  height: auto;
  color: ${variables.palette.shades80};
`;
