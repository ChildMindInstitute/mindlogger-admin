import { styled, Box } from '@mui/material';

import { theme, variables, StyledClearedButton, StyledFlexTopCenter } from 'shared/styles';

export const StyledLegend = styled(Box)`
  padding: ${theme.spacing(1.2, 1.6, 0)};
  overflow: auto;
`;

export const StyledSelect = styled(Box)`
  .MuiOutlinedInput-notchedOutline {
    border: 0;
  }

  .MuiOutlinedInput-input.MuiInputBase-input {
    font-size: ${variables.font.size.xl};
    min-height: auto;
    padding-left: 0;
  }

  .MuiSelect-icon {
    right: 0.1rem;
    top: auto;
  }
`;

export const StyledIndicator = styled(Box)`
  width: 2rem;
  height: 2rem;
  position: relative;
  background-color: ${({ colors }: { colors: string[] }) => colors[1]};
  border-radius: ${variables.borderRadius.xs};
  margin-right: ${theme.spacing(1.2)};

  &:before {
    content: '';
    position: absolute;
    width: 0.8rem;
    height: 0.8rem;
    background-color: ${({ colors }) => colors[0]};
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: ${variables.borderRadius.half};
  }
`;

export const StyledCreateBtn = styled(StyledFlexTopCenter)`
  cursor: pointer;
  color: ${variables.palette.outline};

  svg {
    margin-right: ${theme.spacing(1)};
  }
`;

export const StyledDeactivated = styled(StyledFlexTopCenter)`
  color: ${variables.palette.on_surface_alfa38};
`;

export const StyledBtnsRow = styled(StyledFlexTopCenter)`
  justify-content: flex-end;
  margin-bottom: ${theme.spacing(1.8)};
`;

export const StyledSelectRow = styled(StyledFlexTopCenter)`
  justify-content: space-between;
  margin-bottom: ${theme.spacing(1.5)};

  svg {
    fill: ${variables.palette.on_surface_variant};
  }
`;

export const StyledBtn = styled(StyledClearedButton)`
  font-weight: ${variables.font.weight.regular};
  padding: ${theme.spacing(0.9, 1.6)};

  svg {
    margin-right: ${theme.spacing(1)};
    fill: ${variables.palette.primary};
  }
`;

export const StyledSearchContainer = styled(Box)`
  position: relative;
  margin-bottom: ${theme.spacing(1.5)};
`;

export const StyledIconBtn = styled(StyledClearedButton)`
  padding: ${theme.spacing(1)};
`;
