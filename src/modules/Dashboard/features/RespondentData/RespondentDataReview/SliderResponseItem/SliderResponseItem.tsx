import { createArray } from 'shared/utils';

import { SliderItemAnswer } from '../RespondentDataReview.types';
import { StyledSlider } from './SliderResponseItem.styles';

export const SliderResponseItem = ({ activityItem, answer }: SliderItemAnswer) => {
  const { minValue, maxValue } = activityItem.responseValues;
  const marks = createArray(maxValue - minValue + 1, (index: number) => ({
    value: minValue + index,
    label: minValue + index,
  }));

  return (
    <StyledSlider
      marks={marks}
      min={minValue}
      max={maxValue}
      value={Number(answer?.value)}
      disabled
    />
  );
};
