import { Box } from '@mui/material';
import { styled } from '@mui/system';

import { StyledFlexTopCenter, StyledClearedButton } from 'shared/styles/styledComponents';
import theme from 'shared/styles/theme';
import { variables } from 'shared/styles/variables';
import { shouldForwardProp } from 'shared/utils/shouldForwardProp';

export const StyledActionsWrapper = styled(StyledFlexTopCenter)`
  width: 100%;
  height: 100%;

  svg {
    fill: ${variables.palette.on_surface_variant};
  }
`;

export const StyledActions = styled(Box)`
  display: flex;

  span + span button {
    margin-left: ${theme.spacing(0.8)};
  }
`;

export const StyledActionButton = styled(StyledClearedButton, shouldForwardProp)`
  width: 4rem;
  height: 4rem;
  min-width: 4rem;
  border-radius: ${variables.borderRadius.half};
  background-color: ${({ isActive }: { isActive: boolean; disabled: boolean }) =>
    isActive ? variables.palette.secondary_container : 'transparent'};

  &:hover {
    background: ${variables.palette.secondary_container};

    svg {
      fill: ${variables.palette.primary};
    }
  }

  svg {
    fill: ${({ disabled }) =>
      disabled ? variables.palette.surface_variant : variables.palette.on_surface_variant};
  }
`;
