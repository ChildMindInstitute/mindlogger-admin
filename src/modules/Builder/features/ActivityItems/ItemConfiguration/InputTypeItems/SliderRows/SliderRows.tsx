import { useTranslation } from 'react-i18next';
import { Button } from '@mui/material';
import get from 'lodash.get';

import { Svg } from 'shared/components/Svg';
import { theme, StyledFlexColumn } from 'shared/styles';
import { ItemAlert, SliderItemResponseValues } from 'shared/state';
import { useCustomFormContext } from 'modules/Builder/hooks';

import { SliderPanel } from './SliderPanel';
import { SliderProps } from './SliderRows.types';
import { getEmptySliderOption } from '../../ItemConfiguration.utils';
import { ItemConfigurationSettings } from '../../ItemConfiguration.types';

export const SliderRows = ({ name, isMultiple = false }: SliderProps) => {
  const { t } = useTranslation('app');
  const { watch, setValue } = useCustomFormContext();

  const sliderName = isMultiple ? `${name}.responseValues.rows` : `${name}.responseValues`;
  const alertsName = `${name}.alerts`;
  const value = watch(sliderName);
  const settings = watch(`${name}.config`);
  const hasScores = get(settings, ItemConfigurationSettings.HasScores);
  const alerts = watch(alertsName) as ItemAlert[];

  const handleAddSlider = () => {
    setValue(sliderName, [...(value ?? []), getEmptySliderOption({ isMultiple, hasScores })]);
  };
  const handleRemoveSlider = (id?: string) => {
    setValue(sliderName, value?.filter(({ id: sliderId }: SliderItemResponseValues) => sliderId !== id));
    if (id && isMultiple && alerts?.length) {
      setValue(
        alertsName,
        alerts.filter(alert => alert.sliderId !== id),
      );
    }
  };

  return (
    <StyledFlexColumn sx={{ mb: theme.spacing(2), gap: '2.4rem' }}>
      {!isMultiple && <SliderPanel name={name} label={t('sliderOption')} />}
      {isMultiple &&
        Array.isArray(value) &&
        value.map(({ id }: SliderItemResponseValues, index: number) => (
          <SliderPanel
            key={`slider-panel-${id}`}
            name={name}
            index={index}
            label={t('sliderOption', {
              context: 'indexed',
              index: index + 1,
            })}
            isMultiple
            onRemove={() => handleRemoveSlider(id)}
          />
        ))}
      {isMultiple && (
        <Button
          onClick={handleAddSlider}
          variant="outlined"
          startIcon={<Svg id="add" width="20" height="20" />}
          sx={{ width: '13.2rem' }}
          data-testid="builder-activity-items-item-configuration-slider-add-slider">
          {t('addSlider')}
        </Button>
      )}
    </StyledFlexColumn>
  );
};
