import { styled } from '@mui/material';
import Chip from '@mui/material/Chip';

import { variables } from 'shared/styles/variables';
import { theme } from 'shared/styles';
import { StyledClearedButton as ClearedButton } from 'shared/styles/styledComponents';

import { ChipShape } from './Chip.types';

export const StyledChip = styled(Chip)`
  border-radius: ${({ shape }: { shape: ChipShape }) =>
    shape === ChipShape.Rounded ? variables.borderRadius.xxl : variables.borderRadius.md};

  &.MuiButtonBase-root.MuiChip-root {
    margin: ${theme.spacing(0.4, 0, 0.4, 0.6)};
  }
`;

export const StyledClearedButton = styled(ClearedButton)`
  &.MuiButtonBase-root.MuiButton-root.MuiButton-text:hover {
    background-color: transparent;
  }
`;
