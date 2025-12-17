import { Box, Button, styled } from '@mui/material';

import {
  StyledBodyMedium,
  StyledClearedButton,
  StyledHeadlineSmall,
  theme,
  variables,
} from 'shared/styles';

// Container matching Figma specifications
export const StyledMFAContainer = styled(Box)`
  width: 473px;
  padding: ${theme.spacing(4)}; // 32px
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: ${theme.spacing(4)}; // 32px
  border-radius: ${variables.borderRadius.lg2}; // 16px
  border: ${variables.borderWidth.md} solid ${variables.palette.surface_variant};
  background: ${variables.palette.surface};
`;

export const StyledMFAForm = styled('form')`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${theme.spacing(2.4)};
`;

export const StyledMFAHeadline = styled(StyledHeadlineSmall)`
  color: ${variables.palette.on_surface};
  text-align: center;
`;

export const StyledMFASubheader = styled(StyledBodyMedium)`
  color: ${variables.palette.on_surface_variant};
  text-align: center;
  margin: 0;
`;

export const StyledMFAController = styled(Box)`
  width: 100%;
`;

// Link without underline for MFA forms
export const StyledMFALink = styled(StyledClearedButton)`
  color: ${variables.palette.primary};
  font-size: ${variables.font.size.label1};
  line-height: ${variables.font.lineHeight.label1};
  font-weight: ${variables.font.weight.regular};
  text-decoration: none; // No underline as per design
  margin: ${theme.spacing(1.2, 0, 0.8)};

  &.MuiButton-text:hover {
    background-color: transparent;
    text-decoration: none;
  }
` as typeof Button;

export const StyledMFAButton = styled(Button)`
  width: 100%;
  margin-top: ${theme.spacing(1.2)};
`;

// Back button for recovery form
export const StyledBackButton = styled(Button)`
  width: 100%;
  margin-top: ${theme.spacing(1.6)};
`;
