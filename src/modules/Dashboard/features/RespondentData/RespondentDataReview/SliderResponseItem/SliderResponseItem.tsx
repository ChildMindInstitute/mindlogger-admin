import { createArrayForSlider } from 'modules/Dashboard/features/RespondentData/RespondentData.utils';

import { SliderItemAnswer } from '../RespondentDataReview.types';
import { StyledSlider } from './SliderResponseItem.styles';

export const SliderResponseItem = ({
  activityItem,
  answer,
  'data-testid': dataTestid,
}: SliderItemAnswer) => {
  const { minValue, maxValue } = activityItem.responseValues;
  const maxValueNumber = Number(maxValue);
  const minValueNumber = Number(minValue);
  const marks = createArrayForSlider({
    maxValue: maxValueNumber,
    minValue: minValueNumber,
  });

  return (
    <StyledSlider
      disabled
      marks={marks}
      min={minValueNumber}
      max={maxValueNumber}
      value={isNaN(Number(answer?.value)) ? 0 : Number(answer?.value)}
      data-skipped={answer?.value === undefined || answer?.value === null}
      data-testid={dataTestid}
    />
  );
};
