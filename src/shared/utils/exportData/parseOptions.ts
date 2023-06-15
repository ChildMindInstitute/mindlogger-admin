import { SingleAndMultipleSelectItemResponseValues } from 'shared/state';

import { joinWihComma } from '../joinWihComma';

export const parseOptions = (responseValues: SingleAndMultipleSelectItemResponseValues) =>
  joinWihComma(responseValues?.options?.map((option) => `${option.text}: ${option.value}`) || []);
