import { styled, TextField } from '@mui/material';

import { variables, theme } from 'shared/styles';
import { shouldForwardProp } from 'shared/utils';

export const StyledTextField = styled(TextField, shouldForwardProp)`
  ${({ isSecondaryUiType }: { isSecondaryUiType: boolean }) =>
    isSecondaryUiType &&
    `
    .MuiInputBase-root {
      min-height: 5.6rem;
      padding: ${theme.spacing(0.4, 1, 0.4, 4)};
      flex-wrap: wrap;
    }

    .MuiInputBase-input {
      padding: ${theme.spacing(0.6)};
      width: auto;
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
