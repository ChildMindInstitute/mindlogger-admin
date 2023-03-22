import { useTranslation } from 'react-i18next';

import { THRESHOLD_SIZE } from 'shared/components/MarkDownEditor/MarkDownEditor';

import { FooterMessageProps } from './FooterMessage.types';
import { StyledText } from './FooterMessage.styles';

export const FooterMessage = ({ inputSize }: FooterMessageProps) => {
  const { t } = useTranslation('app');

  if (inputSize <= THRESHOLD_SIZE) return null;

  return (
    <StyledText>
      {t('thresholdMessage', {
        size: THRESHOLD_SIZE,
      })}
    </StyledText>
  );
};
