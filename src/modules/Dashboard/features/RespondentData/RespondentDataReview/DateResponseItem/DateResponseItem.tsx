import { DatePickerInput } from 'shared/components/DatePicker/DatePickerInput';

import { DateItemAnswer } from '../RespondentDataReview.types';
import { getDateForamttedResponse } from '../../RespondentData.utils';

export const DateResponseItem = ({ answer }: DateItemAnswer) => {
  if (!answer) return null;

  const value = getDateForamttedResponse(answer);

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
