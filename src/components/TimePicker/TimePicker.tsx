import { TextField } from '@mui/material';
import { useState } from 'react';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { StyledTimePickerWrapper } from './TimePicker.styles';

export const TimePicker = () => {
  const [time, setTime] = useState<Date | null | undefined>();

  return (
    <StyledTimePickerWrapper>
      <ReactDatePicker
        className="date-picker"
        selected={time}
        onChange={(date: Date) => setTime(date)}
        showTimeSelect
        showTimeSelectOnly
        timeIntervals={15}
        showPopperArrow={false}
        dateFormat="HH:mm"
        timeFormat="HH:mm"
        customInput={<TextField variant="outlined" label="From" />}
      />
    </StyledTimePickerWrapper>
  );
};
