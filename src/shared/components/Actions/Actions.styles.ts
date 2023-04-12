import { Box, styled } from '@mui/material';

import { StyledFlexTopCenter, StyledClearedButton, theme, variables } from 'shared/styles';
import { shouldForwardProp } from 'shared/utils/shouldForwardProp';

import { Svg } from '../Svg';

export const StyledActionsWrapper = styled(StyledFlexTopCenter)`
  width: 100%;
  height: 100%;
  justify-content: flex-end;

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

export const StyledDotsSvg = styled(Svg)`
  margin: ${theme.spacing(0, 1, 0, 2)};
`;
