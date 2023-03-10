import { useTranslation } from 'react-i18next';
import { FieldValues } from 'react-hook-form';

import { InputController } from 'components/FormComponents';
import { StyledFlexTopCenter } from 'styles/styledComponents';
import theme from 'styles/theme';

import { StyledInputWrapper } from './NumberSelection.styles';
import { NumberSelectionProps } from './NumberSelection.types';
import { ItemOptionContainer } from '../ItemOptionContainer';

export const NumberSelection = <T extends FieldValues>({
  name,
  maxName,
  control,
}: NumberSelectionProps<T>) => {
  const { t } = useTranslation('app');

  const commonProps = {
    control,
    type: 'number',
  };

  return (
    <ItemOptionContainer title={t('numberSelection')}>
      <StyledFlexTopCenter sx={{ justifyContent: 'space-between' }}>
        <StyledInputWrapper sx={{ mr: theme.spacing(1.25) }}>
          <InputController {...commonProps} name={name} label={t('minValue')} />
        </StyledInputWrapper>
        <StyledInputWrapper sx={{ ml: theme.spacing(1.25) }}>
          <InputController {...commonProps} name={maxName} label={t('maxValue')} />
        </StyledInputWrapper>
      </StyledFlexTopCenter>
    </ItemOptionContainer>
  );
};
