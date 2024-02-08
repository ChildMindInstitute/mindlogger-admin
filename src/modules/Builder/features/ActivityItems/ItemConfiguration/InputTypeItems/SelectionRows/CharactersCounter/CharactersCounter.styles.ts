import { styled } from '@mui/material';

import { StyledCounter as Counter } from 'shared/components/FormComponents/InputController/Input';
import { theme, variables } from 'shared/styles';
import { shouldForwardProp } from 'shared/utils';

export const StyledCounter = styled(Counter, shouldForwardProp)`
  white-space: nowrap;
  color: ${({ hasError }: { hasError?: boolean }) =>
    hasError ? variables.palette.semantic.error : variables.palette.on_surface_variant};

  .shortened-counter {
    display: none;
  }

  ${({ isShortenedVisible }: { isShortenedVisible?: boolean }) =>
    isShortenedVisible &&
    `
    ${theme.breakpoints.down('xxl')} {
      .shortened-counter {
        display: inline;
       }
    
      .primary-counter {
        display: none;
      }
    }
  `}
`;
