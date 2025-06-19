import { styled } from '@mui/material';
import Chip from '@mui/material/Chip';

import { theme } from 'shared/styles';
import { StyledClearedButton as ClearedButton } from 'shared/styles/styledComponents';
import { variables } from 'shared/styles/variables';

import { ChipShape } from './Chip.types';

export const StyledChip = styled(Chip)`
  border-radius: ${({ shape }: { shape: ChipShape }) =>
    ({
      [ChipShape.Rounded]: variables.borderRadius.xxxl2,
      [ChipShape.Rectangular]: variables.borderRadius.md,
      [ChipShape.RectangularLarge]: variables.borderRadius.xs,
    })[shape]};

  ${({ shape }) =>
    shape === ChipShape.RectangularLarge &&
    `
      padding: ${theme.spacing(0.6, 1.2)};
      height: auto;
    `}

  &.MuiButtonBase-root.MuiChip-root {
    margin: ${theme.spacing(0.4, 0, 0.4, 0.6)};
  }
`;

export const StyledClearedButton = styled(ClearedButton)`
  &.MuiButtonBase-root.MuiButton-root.MuiButton-text:hover {
    background-color: transparent;
  }
`;
