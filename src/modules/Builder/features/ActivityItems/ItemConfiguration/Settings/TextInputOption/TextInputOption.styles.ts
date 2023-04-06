import { Box, styled } from '@mui/material';

import {
  theme,
  variables,
  StyledFlexColumn,
  StyledFlexTopCenter,
  StyledBodyMedium,
} from 'shared/styles';

export const StyledTextInputOptionContainer = styled(StyledFlexColumn)`
  background: ${variables.palette.surface1};
  padding: ${theme.spacing(3, 3, 2.1, 3)};
  border-radius: ${variables.borderRadius.lg2};
`;

export const StyledTextInputOptionHeader = styled(StyledFlexTopCenter)`
  width: 100%;
  justify-content: space-between;
`;

export const StyledTextInputOptionDescription = styled(Box)`
  padding: ${theme.spacing(1.6)};
  border: ${variables.borderWidth.md} solid ${variables.palette.surface_variant};
  border-radius: ${variables.borderRadius.xs};
  margin-top: ${theme.spacing(2.8)};
`;

export const StyledTextInputOptionHelpText = styled(StyledBodyMedium)`
  opacity: 0.38;
  margin-left: ${theme.spacing(1.6)};
`;
