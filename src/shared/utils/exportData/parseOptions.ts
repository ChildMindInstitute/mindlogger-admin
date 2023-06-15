import { SingleAndMultipleSelectItemResponseValues } from 'shared/state';

import { joinWihComma } from '../joinWihComma';

export const parseOptions = (responseValues: SingleAndMultipleSelectItemResponseValues) =>
  joinWihComma(
    responseValues?.options?.map(
      ({ text, value, score }) => `${text}: ${value}${score ? ` (score: ${score})` : ''}`,
    ) || [],
  );
