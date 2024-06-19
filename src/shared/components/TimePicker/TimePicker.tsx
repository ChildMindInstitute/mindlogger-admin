import { lazy, Suspense } from 'react';
import { TextField } from '@mui/material';
import { Controller, FieldValues } from 'react-hook-form';
import { parse, format as dateFnsFormat } from 'date-fns';

import { Svg } from 'shared/components/Svg';
import { DateFormats } from 'shared/consts';

import { StyledIcon, StyledTimePickerWrapper } from './TimePicker.styles';
import { TimePickerProps } from './TimePicker.types';

const ReactDatePicker = lazy(() => import('react-datepicker'));

export const TimePicker = <T extends FieldValues>({
  control,
  timeIntervals = 15,
  format = DateFormats.Time,
  label,
  name,
  wrapperSx = {},
  minTime,
  maxTime,
  onCustomChange,
  'data-testid': dataTestid,
  placeholder,
  inputSx = {},
}: TimePickerProps<T>) => (
  <Controller
    control={control}
    name={name}
    render={({ field: { onChange, value }, fieldState: { error } }) => {
      const selected = value ? parse(value, DateFormats.Time, new Date()) : value;
      const handleChange = (date: Date) => {
        const newTime = dateFnsFormat(date, DateFormats.Time);
        onCustomChange?.(newTime);
        onChange(newTime);
      };

      return (
        <StyledTimePickerWrapper sx={{ ...wrapperSx }} data-testid={dataTestid}>
          <Suspense>
            <ReactDatePicker
              className="date-picker"
              selected={selected as Date | null | undefined}
              onChange={handleChange}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={timeIntervals}
              showPopperArrow={false}
              dateFormat={format}
              timeFormat={format}
              minTime={minTime}
              maxTime={maxTime}
              placeholderText={placeholder}
              autoComplete="off"
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
                    sx: { ...inputSx },
                  }}
                />
              }
            />
          </Suspense>
        </StyledTimePickerWrapper>
      );
    }}
  />
);
