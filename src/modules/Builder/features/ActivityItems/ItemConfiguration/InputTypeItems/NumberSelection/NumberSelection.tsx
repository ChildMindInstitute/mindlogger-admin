import { useTranslation } from 'react-i18next';
import { FieldValues } from 'react-hook-form';
import { useEffect } from 'react';

import { InputController } from 'shared/components/FormComponents';
import { StyledFlexTopStart, theme } from 'shared/styles';
import { ItemResponseType } from 'shared/consts';

import { StyledInputWrapper } from './NumberSelection.styles';
import { NumberSelectionProps } from './NumberSelection.types';
import { ItemOptionContainer } from '../ItemOptionContainer';
import { useOptionalItemSetup } from '../../ItemConfiguration.hooks';
import { DEFAULT_MAX_NUMBER, DEFAULT_MIN_NUMBER } from '../../ItemConfiguration.const';

export const NumberSelection = <T extends FieldValues>({
  name,
  maxName,
}: NumberSelectionProps<T>) => {
  const { t } = useTranslation('app');

  const { control, watch, setValue } = useOptionalItemSetup({
    itemType: ItemResponseType.NumberSelection,
    name,
    defaultValue: DEFAULT_MIN_NUMBER,
  });

  useOptionalItemSetup({
    itemType: ItemResponseType.NumberSelection,
    name: maxName,
    defaultValue: DEFAULT_MAX_NUMBER,
  });

  const minNumber = watch('minNumber');
  const maxNumber = watch('maxNumber');

  useEffect(() => {
    if (maxNumber !== '') return;

    setValue('maxNumber', Number(minNumber) + 1, {
      shouldValidate: true,
    });
  }, [maxNumber]);

  const commonProps = {
    control,
    type: 'number',
  };

  return (
    <ItemOptionContainer title={t('numberSelection')}>
      <StyledFlexTopStart sx={{ justifyContent: 'space-between' }}>
        <StyledInputWrapper sx={{ mr: theme.spacing(1.25) }}>
          <InputController {...commonProps} name={name} label={t('minValue')} minNumberValue={0} />
        </StyledInputWrapper>
        <StyledInputWrapper sx={{ ml: theme.spacing(1.25) }}>
          <InputController {...commonProps} name={maxName} label={t('maxValue')} />
        </StyledInputWrapper>
      </StyledFlexTopStart>
    </ItemOptionContainer>
  );
};
