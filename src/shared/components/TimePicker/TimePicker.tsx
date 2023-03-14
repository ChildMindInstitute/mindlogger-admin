import { TextField } from '@mui/material';
import ReactDatePicker from 'react-datepicker';
import { Controller, FieldValues } from 'react-hook-form';

import { Svg } from 'shared/components';

import { StyledIcon, StyledTimePickerWrapper } from './TimePicker.styles';
import { TimePickerProps } from './TimePicker.types';

export const TimePicker = <T extends FieldValues>({
  control,
  timeIntervals = 15,
  format = 'HH:mm',
  label,
  name,
  wrapperSx = {},
}: TimePickerProps<T>) => (
  <Controller
    control={control}
    name={name}
    render={({ field: { onChange, value } }) => (
      <StyledTimePickerWrapper sx={{ ...wrapperSx }}>
        <ReactDatePicker
          className="date-picker"
          selected={value}
          onChange={(date: Date) => onChange(date)}
          showTimeSelect
          showTimeSelectOnly
          timeIntervals={timeIntervals}
          showPopperArrow={false}
          dateFormat={format}
          timeFormat={format}
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
    )}
  />
);
