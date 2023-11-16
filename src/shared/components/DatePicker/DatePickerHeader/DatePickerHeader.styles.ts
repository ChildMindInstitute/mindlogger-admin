import { styled, Box } from '@mui/material';

import { theme, variables, StyledClearedButton } from 'shared/styles';
import { shouldForwardProp } from 'shared/utils/shouldForwardProp';

export const StyledHeader = styled(Box, shouldForwardProp)`
  align-items: center;
  padding: ${theme.spacing(0.8, 1.2)};
  display: ${({ isStartEndingDate }: { isStartEndingDate: boolean }) =>
    isStartEndingDate ? 'grid' : 'flex'};
  grid-template-columns: ${({ isStartEndingDate }) =>
    isStartEndingDate ? '1fr auto 1fr' : ' auto'};
`;

export const StyledCol = styled(Box)`
  display: flex;
`;

export const StyledIconBtn = styled(StyledClearedButton)`
  width: 4rem;
  height: 4rem;

  svg {
    fill: ${variables.palette.on_surface_variant};
  }

  &:hover {
    svg {
      fill: ${variables.palette.primary};
    }
  }
`;

export const StyledSelect = styled(Box)`
  color: ${variables.palette.on_surface_variant};
  grid-column-start: 2;
  display: flex;
  align-items: center;

  .MuiTypography-root {
    font-size: ${variables.font.size.lg};
    line-height: ${variables.font.lineHeight.lg};
    font-weight: ${variables.font.weight.regular};
  }

  .MuiSelect-select {
    padding: 0;
  }

  .MuiFormControl-root .MuiInputBase-root .MuiSelect-select.MuiSelect-standard {
    padding-right: ${theme.spacing(2.5)};
  }

  .MuiFormControl-root .MuiInputBase-root .MuiSelect-icon {
    top: 0.3rem;
  }
`;
