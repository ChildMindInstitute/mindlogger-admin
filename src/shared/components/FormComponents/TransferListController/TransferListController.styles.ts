import { TextField, styled } from '@mui/material';

import { StyledBodySmall, StyledFlexTopCenter, theme, variables } from 'shared/styles';
import { shouldForwardProp } from 'shared/utils/shouldForwardProp';

export const StyledTransferListController = styled(StyledFlexTopCenter, shouldForwardProp)`
  position: relative;
  width: 100%;
  gap: 2.4rem;

  > * {
    flex: 1;
    min-width: 0;
  }

  ${({ hasError }: { hasError?: boolean }) =>
    hasError &&
    `
      padding-bottom: ${theme.spacing(1.8)};
  `}
`;

export const StyledErrorContainer = styled(StyledBodySmall)`
  position: absolute;
  bottom: 0;
  left: 1.6rem;
  color: ${variables.palette.error};
`;

export const StyledTextField = styled(TextField)`
  width: calc(50% - 3.2rem);

  .MuiInputBase-root {
    border-radius: ${variables.borderRadius.xxxl2};
    background: ${variables.palette.outline_alpha8};

    fieldset {
      border: none;
    }
  }

  .MuiInputBase-input {
    padding: ${theme.spacing(1.25, 1.6)};
  }

  svg {
    fill: ${variables.palette.outline};
  }
`;
