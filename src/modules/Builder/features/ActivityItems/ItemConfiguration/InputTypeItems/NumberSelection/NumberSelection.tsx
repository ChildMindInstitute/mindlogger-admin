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

export const NumberSelection = ({ name }: NumberSelectionProps) => {
  const { t } = useTranslation('app');

  const responseValuesName = `${name}.responseValues`;
  const minValueName = `${responseValuesName}.minValue`;
  const maxValueName = `${responseValuesName}.maxValue`;

  const { control, watch, setValue } = useOptionalItemSetup({
    itemType: ItemResponseType.NumberSelection,
    name: responseValuesName,
    defaultValue: DEFAULT_MIN_NUMBER,
  });

  useOptionalItemSetup({
    itemType: ItemResponseType.NumberSelection,
    name: `${name}.responseValues`,
    defaultValue: DEFAULT_MAX_NUMBER,
  });

  const minNumber = watch(minValueName);
  const maxNumber = watch(maxValueName);

  useEffect(() => {
    if (maxNumber !== '') return;

    setValue(maxValueName, Number(minNumber) + 1, {
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
          <InputController
            {...commonProps}
            name={`${name}.response`}
            label={t('minValue')}
            minNumberValue={0}
          />
        </StyledInputWrapper>
        <StyledInputWrapper sx={{ ml: theme.spacing(1.25) }}>
          <InputController {...commonProps} name={maxValueName} label={t('maxValue')} />
        </StyledInputWrapper>
      </StyledFlexTopStart>
    </ItemOptionContainer>
  );
};
