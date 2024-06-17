import { KeyboardEvent, lazy, Suspense, useState, ChangeEvent } from 'react';
import { TextField } from '@mui/material';
import { Controller, FieldValues } from 'react-hook-form';
import { parse, format as dateFnsFormat } from 'date-fns';

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
  placeholder,
  inputSx = {},
}: TimePickerProps<T>) => {
  const [inputValue, setInputValue] = useState<string>('');

  const updateInputValue = (value: string, onChange: (value: string) => void) => {
    onCustomChange?.(value);
    setInputValue(value);
    onChange(value);
  };

  const handleInputValue = (onChange: (value: string) => void) => {
    const cleanedInput = cleanInput(inputValue);
    const validatedInput = validateInput(defaultTime, cleanedInput);
    const formattedInput = validatedInput.length === 4 ? formatInput(validatedInput) : defaultTime;
    updateInputValue(formattedInput, onChange);
  };

  const handleKeyDownEnter = (
    event: KeyboardEvent<HTMLDivElement>,
    onChange: (value: string) => void,
  ) => {
    if (event.key !== 'Enter') return;
    handleInputValue(onChange);
  };

  const handleChange = (
    date: Date | null,
    event: ChangeEvent<HTMLInputElement>,
    onChange: (value: string) => void,
  ) => {
    const isSelectedFromDropdown = !event?.target?.value;
    if (isSelectedFromDropdown && date) {
      return updateInputValue(dateFnsFormat(date, DateFormats.Time), onChange);
    }

    setInputValue(event.target.value);
  };

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        const selected = value ? parse(value, DateFormats.Time, new Date()) : value;

        return (
          <StyledTimePickerWrapper sx={{ ...wrapperSx }} data-testid={dataTestid}>
            <Suspense>
              <ReactDatePicker
                className="date-picker"
                selected={selected as Date | null | undefined}
                onChange={(date: Date | null, event: ChangeEvent<HTMLInputElement>) =>
                  handleChange(date, event, onChange)
                }
                onBlur={() => handleInputValue(onChange)}
                onKeyDown={(event) => handleKeyDownEnter(event, onChange)}
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
                    inputProps={{
                      maxLength: 5,
                    }}
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
};
