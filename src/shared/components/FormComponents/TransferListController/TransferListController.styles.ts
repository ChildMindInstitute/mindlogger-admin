import { Box, TextField, styled } from '@mui/material';

import { StyledFlexTopCenter, theme, variables } from 'shared/styles';

export const StyledTransferListController = styled(StyledFlexTopCenter)`
  position: relative;
  width: 100%;
  gap: 2.4rem;
  padding-bottom: ${theme.spacing(2.8)};
`;

export const StyledErrorContainer = styled(Box)`
  position: absolute;
  bottom: 0;
  color: ${variables.palette.semantic.error};
`;

export const StyledTextField = styled(TextField)`
  width: calc(50% - 3.2rem);

  .MuiInputBase-root {
    border-radius: ${variables.borderRadius.xxxl2};
    background: ${variables.palette.outline_alfa8};

    fieldset {
      border: none;
    }
  }

  svg {
    fill: ${variables.palette.outline};
  }
`;
