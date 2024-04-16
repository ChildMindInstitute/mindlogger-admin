import { UseFormSetValue } from 'react-hook-form';

import { RespondentsDataFormValues } from 'modules/Dashboard/features/RespondentData/RespondentData.types';
import {
  DEFAULT_END_DATE,
  DEFAULT_END_TIME,
  DEFAULT_START_DATE,
  DEFAULT_START_TIME,
} from 'modules/Dashboard/features/RespondentData/RespondentData.const';

export const setDefaultFormValues = (setValue: UseFormSetValue<RespondentsDataFormValues>) => {
  setValue('startDate', DEFAULT_START_DATE);
  setValue('endDate', DEFAULT_END_DATE);
  setValue('startTime', DEFAULT_START_TIME);
  setValue('endTime', DEFAULT_END_TIME);
  setValue('filterByIdentifier', false);
  setValue('identifier', []);
};
