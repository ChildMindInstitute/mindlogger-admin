import { SliderItemResponseValues } from 'shared/state/Applet';

export const getSliderOptions = (
  { minValue, maxValue }: SliderItemResponseValues,
  itemId: string,
  step = 1,
) => {
  const min = +minValue;
  const max = +maxValue;

  return Array.from({ length: (max - min) / step + 1 }, (_, index) => ({
    id: `${itemId}-${min + index * step}`,
    text: min + index * step,
    value: min + index * step,
  }));
};
