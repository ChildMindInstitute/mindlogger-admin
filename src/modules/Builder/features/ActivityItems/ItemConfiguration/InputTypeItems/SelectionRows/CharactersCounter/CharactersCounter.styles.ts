import { styled } from '@mui/material';

import { theme } from 'shared/styles';
import { shouldForwardProp } from 'shared/utils';
import { StyledCounter as Counter } from 'shared/components/FormComponents/InputController/Input';

export const StyledCounter = styled(Counter, shouldForwardProp)`
  white-space: nowrap;

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
