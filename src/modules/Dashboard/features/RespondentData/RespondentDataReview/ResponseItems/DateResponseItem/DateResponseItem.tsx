import { DatePickerInput } from 'shared/components/DatePicker/DatePickerInput';

import { DateItemAnswer } from '../../RespondentDataReview.types';
import { getDateFormattedResponse } from '../../../RespondentData.utils';

export const DateResponseItem = ({ answer }: DateItemAnswer) => {
  if (!answer) return null;

  const value = getDateFormattedResponse(answer);

  return (
    <DatePickerInput
      value={value}
      disabled
      inputSx={{
        width: '20rem',
      }}
    />
  );
};
