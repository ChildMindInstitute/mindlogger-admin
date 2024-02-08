import { SingleAndMultipleSelectItemResponseValues, SliderItemResponseValues } from 'shared/state';

export const getRawScores = (responseValues: SingleAndMultipleSelectItemResponseValues & SliderItemResponseValues) => {
  if (responseValues?.scores?.length) {
    return responseValues?.scores?.reduce((acc, item) => acc + (item || 0), 0);
  }

  return responseValues?.options?.reduce((acc, item) => acc + (item?.score || 0), 0);
};
