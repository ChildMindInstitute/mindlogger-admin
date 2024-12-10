import { keyframes, styled } from '@mui/material';
import { HTMLAttributes, PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';

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

const StyledComponent = styled(
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

/**
 * Renders a <span> containing the content, displaying a placeholder if empty and optional
 * animated loading state. Adds appropriate accessibility label.
 */
export const StyledMaybeEmpty = ({
  children,
  isLoading = false,
  ...rest
}: HTMLAttributes<HTMLSpanElement> & PropsWithChildren<{ isLoading?: boolean }>) => {
  const { t } = useTranslation('app');

  let ariaLabel: string | undefined;
  if (isLoading) ariaLabel = t('loadingEllipsis');
  else if (!children && children !== 0) ariaLabel = '--';

  return (
    <StyledComponent isLoading={isLoading} aria-label={ariaLabel} {...rest}>
      {children}
    </StyledComponent>
  );
};
