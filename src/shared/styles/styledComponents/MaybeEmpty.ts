import { keyframes, styled } from '@mui/material';
import { PropsWithChildren } from 'react';

import { variables } from 'shared/styles/variables';
import { shouldForwardProp } from 'shared/utils';

const loadingAnimation = keyframes`
  0% {
    opacity: 0.75;
  }
  50% {
    opacity: 0.25;
  }
  100% {
    opacity: 0.75;
  }
`;

export const StyledMaybeEmpty = styled(
  'span',
  shouldForwardProp,
)<PropsWithChildren<{ isLoading?: boolean }>>(({ children, isLoading = false }) => ({
  transition: variables.transitions.opacity,
  animation: isLoading ? `${loadingAnimation} 1s linear infinite` : 'none',
  ...(!children &&
    children !== 0 && {
      opacity: 0.25,
      '&::after': {
        content: '"--"',
      },
    }),
}));
