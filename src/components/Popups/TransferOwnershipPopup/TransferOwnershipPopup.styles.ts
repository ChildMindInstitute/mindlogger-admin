import { Box, styled } from '@mui/material';

import { StyledLabelMedium, StyledTitleMedium } from 'styles/styledComponents/Typography';

import theme from 'styles/theme';
import { variables } from 'styles/variables';

export const StyledForm = styled('form')`
  padding: ${theme.spacing(0.4, 2.4)};
`;

export const StyledConfirmation = styled(StyledTitleMedium)`
  margin-bottom: ${theme.spacing(2.4)};
`;

export const StyledInputWrapper = styled(Box)`
  .MuiOutlinedInput-root {
    border-radius: ${variables.borderRadius.xxs};
  }
`;

export const StyledErrorText = styled(StyledLabelMedium)`
  position: absolute;
  margin-top: ${theme.spacing(0.4)};
  color: ${variables.palette.semantic.error};
`;
