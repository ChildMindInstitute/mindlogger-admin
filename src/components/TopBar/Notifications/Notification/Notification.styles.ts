import { styled } from '@mui/system';
import { Box, Button } from '@mui/material';

import theme from 'styles/theme';
import { variables } from 'styles/variables';
import { StyledLabelSmall } from 'styles/styledComponents/Typography';
import { StyledFlexTopCenter } from 'styles/styledComponents/Flex';

const commonImgStyles = `
  width: 4rem;
  height: 4rem;
  border-radius: 100%;
`;

export const StyledNotification = styled(Button)`
  width: 100%;
  height: fit-content;
  padding: ${theme.spacing(1.2, 1.6)};
  margin-bottom: ${theme.spacing(1)};
  border-radius: unset;
  border-bottom: ${variables.borderWidth.md} solid ${variables.palette.surface_variant};
  text-align: left;
  display: flex;
  align-items: unset;

  &:hover {
    background-color: transparent;
  }
`;

export const StyledLeftSection = styled(StyledFlexTopCenter)`
  margin-right: ${theme.spacing(2.1)};
`;

export const StyledImageWrapper = styled(Box)`
  ${commonImgStyles};
  background-color: ${variables.palette.primary_container};
  position: relative;
`;

export const StyledImage = styled('img')`
  ${commonImgStyles};
`;

export const StyledLogo = styled('img')`
  width: 2.4rem;
  height: 2.4rem;
  border-radius: 100%;
  border: ${variables.borderWidth.lg} solid ${variables.palette.surface_variant};
  background-color: ${variables.palette.surface_variant};
  position: absolute;
  bottom: -0.75rem;
  right: -0.75rem;
`;

export const StyledInfo = styled(Box)`
  display: flex;
  flex-direction: column;
  width: 20.4rem;
  margin-right: ${theme.spacing(2.1)};
`;

export const StyledRightSection = styled(Box)`
  width: 5.7rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const StyledInfoCircle = styled(Box)`
  width: 0.6rem;
  height: 0.6rem;
  border-radius: 100%;
  background-color: ${variables.palette.semantic.error};
  align-self: flex-end;
`;

export const StyledTimeAgo = styled(StyledLabelSmall)`
  white-space: nowrap;
`;
