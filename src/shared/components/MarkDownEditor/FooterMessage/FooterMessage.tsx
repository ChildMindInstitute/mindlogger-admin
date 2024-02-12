import { useTranslation } from 'react-i18next';

import { FooterMessageProps } from './FooterMessage.types';
import { StyledText } from './FooterMessage.styles';
import { THRESHOLD_SIZE } from '../MarkDownEditor.const';

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
