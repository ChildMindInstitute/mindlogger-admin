import { styled, TextField } from '@mui/material';

import { variables, theme } from 'shared/styles';
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

  input::placeholder {
    color: ${variables.palette.outline};
    opacity: 1;
  }

  ${({ isSecondaryUiType, setMinWidth }: { isSecondaryUiType: boolean; setMinWidth: boolean }) =>
    isSecondaryUiType &&
    `
    .MuiInputBase-root {
      min-height: 5.6rem;
      padding: ${theme.spacing(0, 1, 0, 4)};
      display: flex;

      &.Mui-disabled {
        svg {
          opacity: 0.38;
        }
      }
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
