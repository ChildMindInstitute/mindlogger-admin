import { useTranslation } from 'react-i18next';

import { StyledTitleSmall } from 'shared/styles/styledComponents';
import theme from 'shared/styles/theme';

import { THRESHOLD_SIZE } from '../MarkDownEditor.const';
import { CharacterCounterProps } from './CharacterCounter.types';
import { variables } from '../../../styles';

export const CharacterCounter = ({ inputSize, disabled }: CharacterCounterProps) => {
  const counter = `${inputSize}/${THRESHOLD_SIZE}`;
  const { t } = useTranslation('app');

  return (
    <StyledTitleSmall
      sx={{ m: theme.spacing(0, 1.6), ...(disabled && { color: variables.palette.disabled }) }}
    >
      {counter} {t('characters')}
    </StyledTitleSmall>
  );
};
