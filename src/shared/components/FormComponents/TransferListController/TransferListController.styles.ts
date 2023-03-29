import { Box, TextField, styled } from '@mui/material';

import { StyledFlexColumn, StyledFlexTopCenter, theme, variables } from 'shared/styles';
import { shouldForwardProp } from 'shared/utils';

export const StyledTransferListController = styled(StyledFlexTopCenter)`
  position: relative;
  width: 100%;
  gap: 2.4rem;
  padding-bottom: ${theme.spacing(2.8)};
`;

export const StyledTableContainer = styled(StyledFlexColumn, shouldForwardProp)`
  border: ${({ hasError }: { hasError?: boolean }) =>
    hasError
      ? `${variables.borderWidth.lg} solid ${variables.palette.semantic.error};`
      : `${variables.borderWidth.md} solid ${variables.palette.outline_variant};`}
  border-radius: ${variables.borderRadius.lg2};
  flex-grow: 1;
  height: 28.8rem;
  overflow-y: auto;
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
