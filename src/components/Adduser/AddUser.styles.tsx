import { styled } from '@mui/system';
import { Button, Box } from '@mui/material';

import theme from 'styles/theme';
import { variables } from 'styles/variables';
import { StyledTitleMedium } from 'styles/styledComponents/Typography';

export const StyledRow = styled(Box)`
  display: flex;
`;

export const StyledButton = styled(Button)`
  border-radius: ${variables.borderRadius.xxl};
  margin-top: ${theme.spacing(2.4)};
  box-shadow: none;
`;

export const StyledResetButton = styled(StyledButton)`
  color: ${variables.palette.primary};
  border: 0.1rem solid ${variables.palette.on_surface_variant};
  margin-left: ${theme.spacing(1.2)};
`;

export const StyledTitle = styled(StyledTitleMedium)`
  margin-bottom: ${theme.spacing(1.6)};
  font-weight: ${variables.font.weight.semiBold};
`;
