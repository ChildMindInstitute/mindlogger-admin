import { SliderItemAnswer } from '../RespondentDataReview.types';
import { StyledSlider } from './SliderResponseItem.styles';

export const SliderResponseItem = ({ activityItem, answer }: SliderItemAnswer) => (
  <StyledSlider
    min={activityItem.responseValues.minValue}
    max={activityItem.responseValues.maxValue}
    value={Number(answer.value)}
    disabled
  />
);
