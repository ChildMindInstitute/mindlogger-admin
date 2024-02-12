import { styled } from '@mui/material';
import Chip from '@mui/material/Chip';

import theme from 'shared/styles/theme';
import { variables } from 'shared/styles/variables';
import { StyledClearedButton as ClearedButton } from 'shared/styles/styledComponents';

import { ChipShape } from './Chip.types';

export const StyledChip = styled(Chip)`
  margin: ${theme.spacing(0.8, 0.8, 0, 0)};
  border-radius: ${({ shape }: { shape: ChipShape }) =>
    shape === ChipShape.Rounded ? variables.borderRadius.xxl : variables.borderRadius.md};
`;

export const StyledClearedButton = styled(ClearedButton)`
  &.MuiButtonBase-root.MuiButton-root.MuiButton-text:hover {
    background-color: transparent;
  }
`;
