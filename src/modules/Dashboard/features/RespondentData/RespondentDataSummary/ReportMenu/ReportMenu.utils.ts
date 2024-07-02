import { UseFormSetValue } from 'react-hook-form';

import { RespondentsDataFormValues } from 'modules/Dashboard/features/RespondentData/RespondentData.types';
import { DEFAULT_END_TIME, DEFAULT_START_TIME } from 'shared/consts';

export const setDefaultFormValues = (setValue: UseFormSetValue<RespondentsDataFormValues>) => {
  setValue('startTime', DEFAULT_START_TIME);
  setValue('endTime', DEFAULT_END_TIME);
  setValue('filterByIdentifier', false);
  setValue('identifier', []);
  setValue('versions', []);
};
