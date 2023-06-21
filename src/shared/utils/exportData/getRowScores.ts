import { SingleAndMultipleSelectItemResponseValues, SliderItemResponseValues } from 'shared/state';

export const getRawScores = (
  responseValues: SingleAndMultipleSelectItemResponseValues | SliderItemResponseValues,
) => {
  if ('scores' in responseValues) {
    return responseValues?.scores?.reduce((acc, item) => acc + (item || 0), 0);
  }
  if ('options' in responseValues) {
    return responseValues?.options?.reduce((acc, item) => acc + (item?.score || 0), 0);
  }
};
