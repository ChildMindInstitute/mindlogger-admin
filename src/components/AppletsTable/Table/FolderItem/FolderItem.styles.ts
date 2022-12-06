import { Box, Button, OutlinedInput, styled, TableCell } from '@mui/material';

import { StyledFlexAllCenter, StyledFlexTopCenter } from 'styles/styledComponents/Flex';
import { StyledLabelSmall } from 'styles/styledComponents/Typography';
import theme from 'styles/theme';
import { variables } from 'styles/variables';

export const StyledFolderIcon = styled(StyledFlexAllCenter)`
  height: 3.2rem;
  width: 3.2rem;
  margin-right: ${theme.spacing(1.2)};
`;

export const StyledTextField = styled(OutlinedInput)``;

export const StyledFolderName = styled(StyledFlexTopCenter)`
  flex-wrap: wrap;
`;

export const StyledCountApplets = styled(StyledLabelSmall)`
  color: ${variables.palette.outline};
  margin-left: ${theme.spacing(0.4)};
`;

export const StyledCell = styled(TableCell)`
  position: relative;

  &:hover {
    .cell-actions {
      display: flex;
    }
  }
`;

export const StyledActions = styled(Box)`
  display: none;
  align-items: center;
  position: absolute;
  top: 50%;
  left: 5rem;
  transform: translateY(-50%);
`;

export const StyledActionButton = styled(Button)`
  width: 4rem;
  height: 4rem;
  min-width: 4rem;
  padding: 0;
  border-radius: ${variables.borderRadius.half};
  margin-right: ${theme.spacing(1)};

  &:hover {
    background: ${variables.palette.secondary_container};

    svg {
      fill: ${variables.palette.primary};
    }
  }

  svg {
    fill: ${({ disabled }: { disabled: boolean }) =>
      disabled ? variables.palette.surface_variant : variables.palette.on_surface_variant};
  }
`;
