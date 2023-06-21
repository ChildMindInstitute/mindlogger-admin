import { SingleAndMultipleSelectItemResponseValues, SliderItemResponseValues } from 'shared/state';
import { ItemResponseType } from 'shared/consts';

import { joinWihComma } from '../joinWihComma';

export const parseOptions = (
  responseValues: SingleAndMultipleSelectItemResponseValues | SliderItemResponseValues,
  type: ItemResponseType,
) => {
  if (type === ItemResponseType.Slider && 'minValue' in responseValues) {
    const min = responseValues?.minValue;
    const max = responseValues?.maxValue;
    const scores = responseValues?.scores;
    const options = Array.from({ length: max - min + 1 }, (_, i) => i + min);

    return joinWihComma(
      options?.map(
        (item, i) => `${item}: ${item}${scores?.length ? ` (score: ${scores[i]})` : ''}`,
      ) || [],
    );
  }

  if ('options' in responseValues) {
    return joinWihComma(
      responseValues?.options?.map(
        ({ text, value, score }) =>
          `${text}${value ? `: ${value}` : ''}${score ? ` (score: ${score})` : ''}`,
      ) || [],
    );
  }
};
