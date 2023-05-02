import { StyledBodySmall, StyledFlexTopCenter, variables } from 'shared/styles';
import { createArray } from 'shared/utils';

import { SliderProps } from './Slider.types';
import { StyledSlider, StyledDescriptionItem, StyledImage } from './Slider.styles';
import { continuousSliderStep, sliderStep } from './Slider.const';

export const Slider = ({
  activityItem,
  isDisabled = false,
  onChange,
  value,
  ...sliderProps
}: SliderProps) => {
  const {
    responseValues: { minLabel, maxLabel, minValue, maxValue, minImage, maxImage },
    config: { continuousSlider },
  } = activityItem;

  const marks = createArray(maxValue - minValue + 1, (index: number) => ({
    value: minValue + index,
    label: minValue + index,
  }));

  return (
    <>
      <StyledSlider
        {...sliderProps}
        defaultValue={undefined}
        value={value}
        disabled={isDisabled}
        step={continuousSlider ? continuousSliderStep : sliderStep}
        marks={marks}
        min={minValue}
        max={maxValue}
        valueLabelDisplay="auto"
        onChange={(_, value) => onChange && onChange(value)}
      />
      <StyledFlexTopCenter sx={{ justifyContent: 'space-between' }}>
        <StyledDescriptionItem sx={{ alignItems: 'start' }}>
          {minImage && <StyledImage sx={{ opacity: isDisabled ? 0.6 : 1 }} src={minImage} />}
          {minLabel && (
            <StyledBodySmall
              sx={{ textAlign: 'start' }}
              color={variables.palette.on_surface_variant}
            >
              {minLabel}
            </StyledBodySmall>
          )}
        </StyledDescriptionItem>
        <StyledDescriptionItem sx={{ alignItems: 'end' }}>
          {maxImage && <StyledImage sx={{ opacity: isDisabled ? 0.6 : 1 }} src={maxImage} />}
          {maxLabel && (
            <StyledBodySmall sx={{ textAlign: 'end' }} color={variables.palette.on_surface_variant}>
              {maxLabel}
            </StyledBodySmall>
          )}
        </StyledDescriptionItem>
      </StyledFlexTopCenter>
    </>
  );
};
