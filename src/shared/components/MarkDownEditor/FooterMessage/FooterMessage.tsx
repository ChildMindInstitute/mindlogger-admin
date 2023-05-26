import { useTranslation } from 'react-i18next';

import { FooterMessageProps } from './FooterMessage.types';
import { StyledText } from './FooterMessage.styles';
import { THRESHOLD_SIZE } from '../MarkDownEditor.const';

export const FooterMessage = ({ inputSize }: FooterMessageProps) => {
  const { t } = useTranslation('app');

  if (inputSize <= THRESHOLD_SIZE) return null;

  return (
    <StyledText>
      {t('visibilityDecreasesOverMaxCharacters', {
        max: THRESHOLD_SIZE,
      })}
    </StyledText>
  );
};
