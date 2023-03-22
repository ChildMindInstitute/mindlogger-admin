import { TextField } from '@mui/material';
import ReactDatePicker from 'react-datepicker';
import { Controller, FieldValues } from 'react-hook-form';
import { parse, format as dateFnsFormat } from 'date-fns';

import { Svg } from 'shared/components/Svg';
import { DateFormats } from 'shared/consts';

import { StyledIcon, StyledTimePickerWrapper } from './TimePicker.styles';
import { TimePickerProps } from './TimePicker.types';

export const TimePicker = <T extends FieldValues>({
  control,
  timeIntervals = 15,
  format = DateFormats.Time,
  label,
  name,
  wrapperSx = {},
}: TimePickerProps<T>) => (
  <Controller
    control={control}
    name={name}
    render={({ field: { onChange, value }, fieldState: { error } }) => (
      <StyledTimePickerWrapper sx={{ ...wrapperSx }}>
        <ReactDatePicker
          className="date-picker"
          selected={value ? parse(value, DateFormats.Time, new Date()) : value}
          onChange={(date: Date) => onChange(dateFnsFormat(date, DateFormats.Time))}
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
              error={!!error}
              helperText={error?.message || null}
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
