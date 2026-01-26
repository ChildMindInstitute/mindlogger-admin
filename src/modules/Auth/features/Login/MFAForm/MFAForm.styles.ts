import { Box, Button, styled } from '@mui/material';

import { theme, variables } from 'shared/styles';

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

export const StyledMFAButton = styled(Button)`
  width: 100%;
  margin-top: ${theme.spacing(1.2)};
`;

// Back button for recovery form
export const StyledBackButton = styled(Button)`
  width: 100%;
  margin-top: ${theme.spacing(1.6)};
`;
