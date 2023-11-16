import { createArray } from 'shared/utils';

export const createArrayForSlider = ({
  maxValue,
  minValue,
}: {
  maxValue: number;
  minValue: number;
}) =>
  createArray(maxValue - minValue + 1, (index) => ({
    value: minValue + index,
    label: minValue + index,
  }));
