import { styled, Box, Button } from '@mui/material';

import {
  theme,
  variables,
  StyledFlexWrap,
  StyledBodyLarge,
  StyledFlexSpaceBetween,
} from 'shared/styles';

export const StyledSuccessShared = styled(Box)`
  padding: ${theme.spacing(2.4)};
`;

export const StyledApplet = styled(StyledFlexSpaceBetween)`
  padding: ${theme.spacing(2.4)};
  background-color: ${variables.palette.surface5};
  border-radius: ${variables.borderRadius.lg2};
`;

export const StyledAppletContent = styled(StyledFlexWrap)`
  flex-grow: 1;
  margin-left: ${theme.spacing(1.6)};
`;

export const StyledText = styled(StyledBodyLarge)`
  flex-basis: 100%;
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
