import { useTranslation } from 'react-i18next';

import { StyledTitleSmall } from 'shared/styles/styledComponents';
import theme from 'shared/styles/theme';

import { THRESHOLD_SIZE } from '../MarkDownEditor.const';
import { CharacterCounterProps } from './CharacterCounter.types';

export const CharacterCounter = ({ inputSize }: CharacterCounterProps) => {
  const counter = `${inputSize}/${THRESHOLD_SIZE}`;
  const { t } = useTranslation('app');

  return (
    <StyledTitleSmall sx={{ m: theme.spacing(0, 1) }}>
      {counter} {t('characters')}
    </StyledTitleSmall>
  );
};
