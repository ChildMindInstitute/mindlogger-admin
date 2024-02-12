import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { InputController } from 'shared/components/FormComponents';
import { StyledFlexTopStart, theme } from 'shared/styles';
import { useCustomFormContext } from 'modules/Builder/hooks';

import { StyledInputWrapper } from './NumberSelection.styles';
import { NumberSelectionProps } from './NumberSelection.types';
import { ItemOptionContainer } from '../ItemOptionContainer';

export const NumberSelection = ({ name }: NumberSelectionProps) => {
  const { t } = useTranslation('app');

  const { control, watch, trigger } = useCustomFormContext();

  const commonProps = {
    control,
    type: 'number',
  };

  const minValueName = `${name}.responseValues.minValue`;
  const maxValueName = `${name}.responseValues.maxValue`;
  const minValue = watch(minValueName);
  const maxValue = watch(maxValueName);
  const dataTestid = 'builder-activity-items-item-configuration-number-selection';

  useEffect(() => {
    trigger([minValueName, maxValueName]);
  }, [minValue, maxValue]);

  return (
    <ItemOptionContainer title={t('numberSelection')} data-testid={dataTestid}>
      <StyledFlexTopStart sx={{ justifyContent: 'space-between' }}>
        <StyledInputWrapper sx={{ mr: theme.spacing(1.25) }}>
          <InputController
            {...commonProps}
            name={minValueName}
            label={t('minValue')}
            data-testid={`${dataTestid}-min-value`}
          />
        </StyledInputWrapper>
        <StyledInputWrapper sx={{ ml: theme.spacing(1.25) }}>
          <InputController
            {...commonProps}
            name={maxValueName}
            label={t('maxValue')}
            data-testid={`${dataTestid}-max-value`}
          />
        </StyledInputWrapper>
      </StyledFlexTopStart>
    </ItemOptionContainer>
  );
};
