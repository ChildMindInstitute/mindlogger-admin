import { styled, TextField } from '@mui/material';

import { variables, theme, StyledBodyLarge } from 'shared/styles';
import { shouldForwardProp } from 'shared/utils/shouldForwardProp';

export const StyledTextField = styled(TextField, shouldForwardProp)`
  width: 100%;

  && {
    &:hover {
      .Mui-disabled .MuiOutlinedInput-notchedOutline {
        border-color: ${variables.palette.on_surface_alfa12};
      }
    }
  }

  ${({
    isSecondaryUiType,
    showInputLabel,
    setMinWidth,
  }: {
    isSecondaryUiType: boolean;
    showInputLabel: boolean;
    setMinWidth: boolean;
  }) =>
    isSecondaryUiType &&
    `
    .MuiInputBase-root {
      min-height: 5.6rem;
      padding: ${theme.spacing(0.4, 1, 0.4, 4)};
      display: flex;
      flex-wrap: ${showInputLabel ? 'unset' : 'wrap'};
    }

    .MuiInputBase-input {
      padding: ${theme.spacing(0.6)};
      flex: 1;
      width: 0;
      min-width: ${setMinWidth ? '50%' : '0.01rem'};
    }
    .email {
      position: absolute;
      left: ${theme.spacing(1)};
      top: 50%;
      transform: translateY(-50%);
    }
  `};

  .MuiChip-root {
    margin-top: 0;
  }

  svg {
    fill: ${variables.palette.on_surface_variant};
  }
`;

export const StyledInputLabel = styled(StyledBodyLarge, shouldForwardProp)`
  flex-shrink: ${({ showInputLabel }: { showInputLabel: boolean }) =>
    showInputLabel ? 0 : 'unset'};
  color: ${variables.palette.outline};
`;
