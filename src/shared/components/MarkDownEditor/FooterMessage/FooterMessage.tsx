import { useTranslation } from 'react-i18next';

import { THRESHOLD_SIZE } from '../MarkDownEditor.const';
import { StyledText } from './FooterMessage.styles';
import { FooterMessageProps } from './FooterMessage.types';

export const FooterMessage = ({ inputSize, error }: FooterMessageProps) => {
  const { t } = useTranslation('app');

  if (error) return <StyledText>{error.message}</StyledText>;

  return (
    <StyledText>
      {inputSize > THRESHOLD_SIZE &&
        t('visibilityDecreasesOverMaxCharacters', {
          max: THRESHOLD_SIZE,
        })}
    </StyledText>
  );
};
