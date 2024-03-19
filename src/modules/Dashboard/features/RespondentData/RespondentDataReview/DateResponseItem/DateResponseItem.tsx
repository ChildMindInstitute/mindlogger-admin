import { DatePickerContainer } from 'shared/components/DatePicker/DatePickerContainer';

import { DateItemAnswer } from '../RespondentDataReview.types';
import { getDateForamttedResponse } from '../../RespondentData.utils';

export const DateResponseItem = ({ answer }: DateItemAnswer) => {
  if (!answer) return null;

  const value = getDateForamttedResponse(answer);

  return (
    <DatePickerContainer
      value={value}
      disabled
      inputSx={{
        width: '20rem',
      }}
    />
  );
};
