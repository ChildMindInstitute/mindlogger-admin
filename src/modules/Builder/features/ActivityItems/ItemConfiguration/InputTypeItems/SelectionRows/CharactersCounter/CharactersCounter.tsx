import { PropsWithChildren } from 'react';

import { useTranslation } from 'react-i18next';

import { StyledCounter } from './CharactersCounter.styles';
import { CharactersCounterProps } from './CharactersCounter.types';

export const CharactersCounter = ({
  value,
  maxLength,
  counterProps,
  children,
  hasError,
}: PropsWithChildren<CharactersCounterProps>) => {
  const { t } = useTranslation('app');
  const shortenedText = `${value}/${maxLength} ${t('chars')}`;

  return (
    <StyledCounter hasError={hasError} isShortenedVisible={counterProps?.isShortenedVisible}>
      <span className="primary-counter">{children}</span>
      <span className="shortened-counter">{shortenedText}</span>
    </StyledCounter>
  );
};
