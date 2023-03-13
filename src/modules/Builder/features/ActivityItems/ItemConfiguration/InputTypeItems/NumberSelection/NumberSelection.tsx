import { useTranslation } from 'react-i18next';
import { FieldValues } from 'react-hook-form';

import { InputController } from 'shared/components/FormComponents';
import { StyledLabelBoldLarge, StyledFlexTopCenter } from 'shared/styles/styledComponents';
import theme from 'shared/styles/theme';

import { StyledInputWrapper, StyledNumberSelectionContainer } from './NumberSelection.styles';
import { NumberSelectionProps } from './NumberSelection.types';

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
    <StyledNumberSelectionContainer>
      <StyledLabelBoldLarge sx={{ marginBottom: theme.spacing(3.8) }}>
        {t('numberSelection')}
      </StyledLabelBoldLarge>
      <StyledFlexTopCenter sx={{ justifyContent: 'space-between' }}>
        <StyledInputWrapper sx={{ mr: theme.spacing(1.25) }}>
          <InputController {...commonProps} name={name} label={t('minValue')} />
        </StyledInputWrapper>
        <StyledInputWrapper sx={{ ml: theme.spacing(1.25) }}>
          <InputController {...commonProps} name={maxName} label={t('maxValue')} />
        </StyledInputWrapper>
      </StyledFlexTopCenter>
    </StyledNumberSelectionContainer>
  );
};
