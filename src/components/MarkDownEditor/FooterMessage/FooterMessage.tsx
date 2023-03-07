import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { FooterMessageProps } from './FooterMessage.types';
import { StyledText } from './FooterMessage.styles';
import { THRESHOLD_SIZE } from '../MarkDownEditor';

const FooterMessage: FC<FooterMessageProps> = ({ inputSize }) => {
  const { t } = useTranslation('app');

  if (inputSize <= THRESHOLD_SIZE) return null;

  return (
    <StyledText>
      {t('mdEditorThresholdMessage', {
        size: THRESHOLD_SIZE,
      })}
    </StyledText>
  );
};

export { FooterMessage };
