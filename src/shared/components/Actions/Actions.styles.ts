import { Box, styled } from '@mui/material';

import { StyledFlexTopCenter, StyledClearedButton, theme, variables } from 'shared/styles';
import { shouldForwardProp } from 'shared/utils/shouldForwardProp';

import { Svg } from '../Svg';

export const StyledActionsWrapper = styled(StyledFlexTopCenter)`
  width: 100%;
  height: 100%;

  svg {
    fill: ${variables.palette.on_surface_variant};
  }
`;

export const StyledActions = styled(Box, shouldForwardProp)`
  display: flex;

  span + span button {
    margin-left: ${({ isVisible }: { isVisible: boolean }) => (isVisible ? theme.spacing(0.8) : 0)};
  }
`;

export const StyledActionButton = styled(StyledClearedButton, shouldForwardProp)`
  height: 4rem;
  border-radius: ${variables.borderRadius.half};
  background-color: ${({ isActive }: { isActive: boolean; disabled: boolean; isVisible: boolean | undefined }) =>
    isActive ? variables.palette.secondary_container : 'transparent'};

  ${({ isVisible }) => `
    opacity: ${isVisible ? 1 : 0};
    width: ${isVisible ? '4rem' : 0};
    min-width: ${isVisible ? '4rem' : 0};
  `};

  &:hover {
    background: ${variables.palette.secondary_container};
  }

  svg {
    fill: ${({ disabled }) => (disabled ? variables.palette.surface_variant : variables.palette.on_surface_variant)};
  }
`;

export const StyledDotsSvg = styled(Svg, shouldForwardProp)`
  ${({ isVisible }: { isVisible: boolean }) => `
      margin: ${isVisible ? theme.spacing(0, 1, 0, 2) : 0};
      opacity: ${isVisible ? 1 : 0};
      width: ${isVisible ? 'auto' : 0};
  `}
`;
