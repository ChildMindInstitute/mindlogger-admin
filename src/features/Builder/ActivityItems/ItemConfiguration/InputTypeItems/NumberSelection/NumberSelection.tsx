import { useTranslation } from 'react-i18next';
import { FieldValues } from 'react-hook-form';

import { InputController } from 'components/FormComponents';
import { StyledLabelBoldLarge, StyledFlexTopCenter } from 'styles/styledComponents';
import theme from 'styles/theme';

import { StyledNumberSelectionContainer } from './NumberSelection.styles';
import { NumberSelectionProps } from './NumberSelection.types';

export const NumberSelection = <T extends FieldValues>({
  name,
  maxName,
  control,
}: NumberSelectionProps<T>) => {
  const { t } = useTranslation('app');

  return (
    <StyledNumberSelectionContainer>
      <StyledLabelBoldLarge sx={{ marginBottom: theme.spacing(3.8) }}>
        {t('numberSelection')}
      </StyledLabelBoldLarge>
      <StyledFlexTopCenter sx={{ justifyContent: 'space-between' }}>
        <InputController name={name} control={control} type="number" label={t('minValue')} />
        <InputController name={maxName} control={control} type="number" label={t('maxValue')} />
      </StyledFlexTopCenter>
    </StyledNumberSelectionContainer>
  );
};
