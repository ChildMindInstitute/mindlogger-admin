import { UseFormSetValue } from 'react-hook-form';

import { RespondentsDataFormValues } from '../../RespondentData.types';
import { getOneWeekDateRange } from './getOneWeekDateRange';

export const setDateRangeFormValues = (
  setValue: UseFormSetValue<RespondentsDataFormValues>,
  lastAnswerDate: string | null,
) => {
  const { startDate, endDate } = getOneWeekDateRange(lastAnswerDate);
  startDate && setValue('startDate', startDate);
  endDate && setValue('endDate', endDate);
};
