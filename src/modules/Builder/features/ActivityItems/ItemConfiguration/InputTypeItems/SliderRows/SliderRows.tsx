import { useTranslation } from 'react-i18next';
import { FieldValues, Controller } from 'react-hook-form';
import { Button } from '@mui/material';

import { Svg } from 'shared/components';
import { StyledFlexColumn } from 'shared/styles/styledComponents';

import { SliderPanel } from './SliderPanel';
import { SliderProps } from './SliderRows.types';
import { SliderOption } from '../../ItemConfiguration.types';
import { getEmptySliderOption } from '../../ItemConfiguration.utils';

export const SliderRows = <T extends FieldValues>({
  name,
  control,
  isMultiple,
}: SliderProps<T>) => {
  const { t } = useTranslation('app');

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value } }) => {
        const handleAddSlider = () => {
          onChange([...value, getEmptySliderOption()]);
        };

        return (
          <StyledFlexColumn sx={{ gap: '2.4rem' }}>
            {value?.map(({ id }: SliderOption, index: number) => {
              const handleRemove = () => {
                onChange(value.filter(({ id: sliderId }: SliderOption) => sliderId !== id));
              };

              return (
                <SliderPanel
                  key={`slider-panel-${id}`}
                  name={`${name}[${index}]`}
                  label={t('slider', { context: 'option', index: index + 1 })}
                  isMultiple={isMultiple}
                  onRemove={handleRemove}
                />
              );
            })}
            {isMultiple && (
              <Button
                onClick={handleAddSlider}
                variant="outlined"
                startIcon={<Svg id="add" width="20" height="20" />}
                sx={{ width: '13.2rem', alignSelf: 'center' }}
              >
                {t('addSlider')}
              </Button>
            )}
          </StyledFlexColumn>
        );
      }}
    />
  );
};
