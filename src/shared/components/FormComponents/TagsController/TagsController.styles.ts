import { styled, TextField } from '@mui/material';

import { theme, variables } from 'shared/styles';
import { shouldForwardProp } from 'shared/utils/shouldForwardProp';

export const StyledTextField = styled(TextField, shouldForwardProp)`
  width: 100%;

  && {
    &:hover {
      .Mui-disabled .MuiOutlinedInput-notchedOutline {
        border-color: ${variables.palette.on_surface_alpha12};
      }
    }
  }

  input::placeholder {
    color: ${variables.palette.outline};
    opacity: 1;
  }

  ${({ isSecondaryUiType, setMinWidth }: { isSecondaryUiType: boolean; setMinWidth: boolean }) =>
    isSecondaryUiType &&
    `
    .MuiInputBase-root {
      min-height: 5.6rem;
      padding-left: ${theme.spacing(4)};
      display: flex;
      flex-wrap: wrap;

      &.Mui-disabled {
        svg {
          opacity: 0.38;
        }
      }
    }

    .MuiInputBase-input {
      flex: 1;
      width: 0;
      min-width: ${setMinWidth ? '50%' : '0.01rem'};

      &.MuiOutlinedInput-input {
        margin-left: ${theme.spacing(0.8)};
        padding: 0;
      }
    }

    .email {
      position: absolute;
      left: ${theme.spacing(1)};
      top: 50%;
      transform: translateY(-50%);
    }
  `};

  svg {
    fill: ${variables.palette.on_surface_variant};
  }
`;
