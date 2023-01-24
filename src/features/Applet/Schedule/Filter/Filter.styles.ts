import { styled } from '@mui/system';
import { Box } from '@mui/material';

import theme from 'styles/theme';
import { variables } from 'styles/variables';
import { StyledFlexTopCenter } from 'styles/styledComponents/Flex';
import { StyledClearedButton } from 'styles/styledComponents/ClearedButton';

export const StyledFilter = styled(Box)`
  width: 32rem;
  border-right: ${variables.borderWidth.md} solid ${variables.palette.surface_variant};
  padding: ${theme.spacing(1.2, 1.6, 0)};
  overflow: auto;
  margin: ${theme.spacing(-2.4, -2.4, -1.6)};
`;

export const StyledSelect = styled(Box)`
  width: 190px;
  .MuiOutlinedInput-notchedOutline {
    border: 0;
  }

  .MuiInputBase-input {
    font-size: ${variables.font.size.xl};
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

export const StyledCreateBtn = styled(Box)`
  margin-left: ${theme.spacing(1)};
  color: ${variables.palette.outline};
`;

export const StyledDeactivated = styled(Box)`
  color: ${variables.palette.on_surface_alfa38};
`;

export const StyledRow = styled(StyledFlexTopCenter)`
  justify-content: flex-end;
  margin-bottom: ${theme.spacing(1.8)};
`;

export const StyledBtn = styled(StyledClearedButton)`
  font-weight: ${variables.font.weight.regular};
  padding: ${theme.spacing(0.9, 1.6)};

  svg {
    margin-right: ${theme.spacing(1)};
    fill: ${variables.palette.primary};
  }
`;
