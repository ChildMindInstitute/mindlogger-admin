import { useTranslation } from 'react-i18next';
import { FieldValues } from 'react-hook-form';

import { InputController } from 'components/FormComponents';
import { StyledFlexTopCenter } from 'styles/styledComponents';

import { NumberSelectionProps } from './NumberSelection.types';
import { ItemOptionContainer } from '../ItemOptionContainer';

export const NumberSelection = <T extends FieldValues>({
  name,
  maxName,
  control,
}: NumberSelectionProps<T>) => {
  const { t } = useTranslation('app');

  return (
    <ItemOptionContainer title={t('numberSelection')}>
      <StyledFlexTopCenter sx={{ justifyContent: 'space-between' }}>
        <InputController name={name} control={control} type="number" label={t('minValue')} />
        <InputController name={maxName} control={control} type="number" label={t('maxValue')} />
      </StyledFlexTopCenter>
    </ItemOptionContainer>
  );
};
