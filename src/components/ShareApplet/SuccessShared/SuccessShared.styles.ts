import { styled, Box, Button } from '@mui/material';

import theme from 'styles/theme';
import { variables } from 'styles/variables';
import { StyledBodyLarge } from 'styles/styledComponents/Typography';

export const StyledSuccessShared = styled(Box)`
  padding: ${theme.spacing(2.4)};
`;

export const StyledApplet = styled(Box)`
  padding: ${theme.spacing(2.4)};
  display: flex;
  justify-content: space-between;
  background-color: ${variables.palette.surface5};
  border-radius: ${variables.borderRadius.lg2};
`;

export const StyledAppletContent = styled(Box)`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  margin-left: ${theme.spacing(1.6)};
`;

export const StyledText = styled(StyledBodyLarge)`
  margin-top: ${theme.spacing(1.2)};
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
`;

const commonImgStyles = `
  width: 9.2rem;
  height: 9.2rem;
  border-radius: ${variables.borderRadius.lg};
`;

export const StyledImg = styled('img')`
  ${commonImgStyles};
`;

export const StyledImgPlaceholder = styled(Box)`
  ${commonImgStyles};
  background-color: ${variables.palette.primary_container};
`;

export const StyledLinkBtn = styled(Button)`
  margin-top: ${theme.spacing(2.4)};

  svg {
    fill: ${variables.palette.primary};
  }
`;
