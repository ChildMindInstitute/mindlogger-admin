import { ItemOption } from '../../RespondentData.types';

export const getSortedOptions = (options: ItemOption[]) =>
  options.sort((a, b) => b.value - a.value);
