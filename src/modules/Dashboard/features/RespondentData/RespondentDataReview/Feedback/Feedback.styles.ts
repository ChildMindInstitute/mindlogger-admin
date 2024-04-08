import { styled } from '@mui/material';

import { StyledClearedButton, StyledFlexColumn, theme, variables } from 'shared/styles';
import { shouldForwardProp } from 'shared/utils/shouldForwardProp';

import { ANIMATION_DURATION_MS } from './Feedback.const';

export const StyledContainer = styled(StyledFlexColumn, shouldForwardProp)`
  height: 100%;
  background-color: ${variables.palette.surface1};
  flex-shrink: 0;
  transition: width ${ANIMATION_DURATION_MS}ms ease-in;

  ${({ isOpen }: { isOpen: boolean }) => {
    if (!isOpen) {
      return `
         width: 0;
    `;
    }

    return `
        width: 44rem;
      
        ${theme.breakpoints.down('xl')} {
          width: 40rem;
        }
        ${theme.breakpoints.down('lg')} {
          width: 35rem;
        }
    `;
  }};
`;

export const StyledButton = styled(StyledClearedButton)`
  padding: ${theme.spacing(0.8)};

  svg {
    fill: ${variables.palette.on_surface_variant};
  }
`;
