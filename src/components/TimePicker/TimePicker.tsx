import { TextField } from '@mui/material';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { Svg } from 'components/Svg';

import { StyledIcon, StyledTimePickerWrapper } from './TimePicker.styles';
import { TimePickerProps } from './TimePicker.types';

export const TimePicker = ({ value, setValue, timeIntervals = 15, label }: TimePickerProps) => (
  <StyledTimePickerWrapper>
    <ReactDatePicker
      className="date-picker"
      selected={value}
      onChange={(date: Date) => setValue(date)}
      showTimeSelect
      showTimeSelectOnly
      timeIntervals={timeIntervals}
      showPopperArrow={false}
      dateFormat="HH:mm"
      timeFormat="HH:mm"
      customInput={
        <TextField
          variant="outlined"
          label={label}
          InputProps={{
            endAdornment: (
              <StyledIcon>
                <Svg id="clock" />
              </StyledIcon>
            ),
          }}
        />
      }
    />
  </StyledTimePickerWrapper>
);
