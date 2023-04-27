import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';

import { InputController } from 'shared/components/FormComponents';
import { StyledFlexTopStart, theme } from 'shared/styles';

import { StyledInputWrapper } from './NumberSelection.styles';
import { NumberSelectionProps } from './NumberSelection.types';
import { ItemOptionContainer } from '../ItemOptionContainer';

export const NumberSelection = ({ name }: NumberSelectionProps) => {
  const { t } = useTranslation('app');

  const { control, watch, trigger, clearErrors } = useFormContext();

  const commonProps = {
    control,
    type: 'number',
    minNumberValue: 0,
  };

  const minValueName = `${name}.responseValues.minValue`;
  const maxValueName = `${name}.responseValues.maxValue`;
  const minValue = watch(minValueName);
  const maxValue = watch(maxValueName);

  useEffect(() => {
    trigger([minValueName, maxValueName]);

    return () => {
      clearErrors([minValueName, maxValueName]);
    };
  }, [minValue, maxValue]);

  return (
    <ItemOptionContainer title={t('numberSelection')}>
      <StyledFlexTopStart sx={{ justifyContent: 'space-between' }}>
        <StyledInputWrapper sx={{ mr: theme.spacing(1.25) }}>
          <InputController {...commonProps} name={minValueName} label={t('minValue')} />
        </StyledInputWrapper>
        <StyledInputWrapper sx={{ ml: theme.spacing(1.25) }}>
          <InputController {...commonProps} name={maxValueName} label={t('maxValue')} />
        </StyledInputWrapper>
      </StyledFlexTopStart>
    </ItemOptionContainer>
  );
};
