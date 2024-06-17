import { lazy, Suspense, useState, FocusEvent, ChangeEvent } from 'react';
import { TextField } from '@mui/material';
import { Controller, FieldValues } from 'react-hook-form';
import { parse } from 'date-fns';

import { Svg } from 'shared/components/Svg';
import { DateFormats } from 'shared/consts';

import { StyledIcon, StyledTimePickerWrapper } from './TimePicker.styles';
import { TimePickerProps } from './TimePicker.types';
import { cleanInput, formatInput, validateInput } from './TimePicker.utils';

const ReactDatePicker = lazy(() => import('react-datepicker'));

const DEFAULT_TIME = '23:59';

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
  defaultTime = DEFAULT_TIME,
  'data-testid': dataTestid,
}: TimePickerProps<T>) => {
  const [inputValue, setInputValue] = useState<string>('');

  const handleBlur = (_: FocusEvent<HTMLInputElement>, onChange: (value: string) => void) => {
    const cleanedInput = cleanInput(inputValue);
    const validatedInput = validateInput(defaultTime, cleanedInput);
    const formattedInput = validatedInput.length === 4 ? formatInput(validatedInput) : defaultTime;
    updateInputValue(formattedInput, onChange);
  };

  const handleChange = (_: Date, event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const updateInputValue = (value: string, onChange: (value: string) => void) => {
    onCustomChange?.(value);
    setInputValue(value);
    onChange(value);
  };

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        const selected = value ? parse(value, DateFormats.Time, new Date()) : null;

        return (
          <StyledTimePickerWrapper sx={{ ...wrapperSx }} data-testid={dataTestid}>
            <Suspense>
              <ReactDatePicker
                className="date-picker"
                selected={selected as Date | null | undefined}
                onChange={handleChange}
                onBlur={(event) => handleBlur(event, onChange)}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={timeIntervals}
                showPopperArrow={false}
                dateFormat={format}
                timeFormat={format}
                minTime={minTime}
                maxTime={maxTime}
                customInput={
                  <TextField
                    variant="outlined"
                    label={label}
                    error={!!error}
                    helperText={error?.message || null}
                    inputProps={{
                      maxLength: 5,
                    }}
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
            </Suspense>
          </StyledTimePickerWrapper>
        );
      }}
    />
  );
};
