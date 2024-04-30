import { ItemOption } from 'modules/Dashboard/features/RespondentData/RespondentData.types';
import { ItemResponseType } from 'shared/consts';

import { GetResponseOptionsProps } from '../ResponseOptions.types';

export type MultipleSelectionChartProps = GetResponseOptionsProps & {
  responseType: ItemResponseType;
  options: ItemOption[];
};
