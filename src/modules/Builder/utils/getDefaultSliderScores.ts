import { SliderRowsItemResponseValues } from 'shared/state';
import { createArray } from 'shared/utils';

export const getDefaultSliderScores = ({ minValue, maxValue }: SliderRowsItemResponseValues) =>
  createArray(Number(maxValue) - Number(minValue) + 1, (index) => index + 1);
