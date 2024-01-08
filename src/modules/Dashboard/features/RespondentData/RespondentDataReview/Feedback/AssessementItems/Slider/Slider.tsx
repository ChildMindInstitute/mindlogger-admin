import { StyledBodySmall, StyledFlexTopCenter, variables } from 'shared/styles';
import { createArrayForSlider } from 'modules/Dashboard/features/RespondentData/RespondentData.utils';

import { SliderProps } from './Slider.types';
import { StyledSlider, StyledDescriptionItem, StyledImage } from './Slider.styles';
import { continuousSliderStep, sliderStep } from './Slider.const';

export const Slider = ({
  activityItem,
  isDisabled = false,
  onChange,
  value,
  'data-testid': dataTestid,
  ...sliderProps
}: SliderProps) => {
  const {
    responseValues: { minLabel, maxLabel, minValue, maxValue, minImage, maxImage },
    config: { continuousSlider },
  } = activityItem;
  const maxValueNumber = Number(maxValue);
  const minValueNumber = Number(minValue);
  const marks = createArrayForSlider({
    maxValue: maxValueNumber,
    minValue: minValueNumber,
  });

  return (
    <>
      <StyledSlider
        {...sliderProps}
        defaultValue={undefined}
        value={value}
        disabled={isDisabled}
        step={continuousSlider ? continuousSliderStep : sliderStep}
        marks={marks}
        min={minValueNumber}
        max={maxValueNumber}
        valueLabelDisplay="auto"
        onChange={(_, value) => onChange && onChange(value)}
        data-testid={dataTestid}
      />
      <StyledFlexTopCenter sx={{ justifyContent: 'space-between' }}>
        <StyledDescriptionItem sx={{ alignItems: 'start' }}>
          {minImage && (
            <StyledImage
              data-testid={`${dataTestid}-min-image`}
              sx={{ opacity: isDisabled ? 0.6 : 1 }}
              src={minImage}
            />
          )}
          {minLabel && (
            <StyledBodySmall
              data-testid={`${dataTestid}-min-label`}
              sx={{ textAlign: 'start' }}
              color={variables.palette.on_surface_variant}
            >
              {minLabel}
            </StyledBodySmall>
          )}
        </StyledDescriptionItem>
        <StyledDescriptionItem sx={{ alignItems: 'end' }}>
          {maxImage && (
            <StyledImage
              data-testid={`${dataTestid}-max-image`}
              sx={{ opacity: isDisabled ? 0.6 : 1 }}
              src={maxImage}
            />
          )}
          {maxLabel && (
            <StyledBodySmall
              data-testid={`${dataTestid}-max-label`}
              sx={{ textAlign: 'end' }}
              color={variables.palette.on_surface_variant}
            >
              {maxLabel}
            </StyledBodySmall>
          )}
        </StyledDescriptionItem>
      </StyledFlexTopCenter>
    </>
  );
};
