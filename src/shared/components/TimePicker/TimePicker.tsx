import { KeyboardEvent, lazy, Suspense, useState, ChangeEvent } from 'react';
import { TextField } from '@mui/material';
import { Controller, FieldValues } from 'react-hook-form';
import { parse, format as dateFnsFormat, isValid } from 'date-fns';

import { Svg } from 'shared/components/Svg';
import { DEFAULT_END_TIME, DateFormats } from 'shared/consts';
import { StyledIcon, StyledTimePickerWrapper } from './TimePicker.styles';
import { HandleChange, InputOnChange, TimePickerProps } from './TimePicker.types';
import { cleanInput, formatInput, validateInput } from './TimePicker.utils';
import { TIME_PICKER_MAX_LENGTH } from './TimePicker.const';

const ReactDatePicker = lazy(() => import('react-datepicker'));

function safeParseTimeString(timeString: string, formatStr: string = 'HH:mm'): Date | null {
  if (!timeString) return null;
  try {
    const date = parse(timeString, formatStr, new Date());
    return isValid(date) ? date : null;
  } catch {
    return null;
  }
}

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
  defaultTime = DEFAULT_END_TIME,
  'data-testid': dataTestid,
  placeholder,
  inputSx = {},
}: TimePickerProps<T>) => {
  const [inputValue, setInputValue] = useState<string>('');

  const updateInputValue = (value: string, onChange: InputOnChange) => {
    onCustomChange?.(value);

    if (!value || value.trim() === '' || value.includes('undefined')) {
      setInputValue('');
      onChange('');
      return;
    }

    setInputValue(value);
    onChange(value);
  };

  const handleInputValue = (onChange: InputOnChange) => {
    if (!inputValue) return;
    const cleaned = cleanInput(inputValue);
    const validated = validateInput(defaultTime, cleaned);
    const finalValue = formatInput(validated);
    updateInputValue(finalValue, onChange);
  };

  const handleKeyDownEnter = (event: KeyboardEvent<HTMLDivElement>, onChange: InputOnChange) => {
    if (event.key !== 'Enter') return;
    handleInputValue(onChange);
  };

  const handleChange = ({ date, event, onChange }: HandleChange) => {
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
        const selected = value ? safeParseTimeString(value, format) : null;
        if (value && value !== inputValue) {
          setInputValue(value);
        }

        return (
          <StyledTimePickerWrapper sx={{ ...wrapperSx }} data-testid={dataTestid}>
            <Suspense>
              <ReactDatePicker
                selected={selected as Date | null}
                onChange={(date: Date | null, event: ChangeEvent<HTMLInputElement>) =>
                  handleChange({ date, event, onChange })
                }
                onBlur={() => handleInputValue(onChange)}
                onKeyDown={(event) => handleKeyDownEnter(event, onChange)}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={timeIntervals}
                dateFormat={format}
                timeFormat={format}
                minTime={minTime}
                maxTime={maxTime}
                placeholderText={placeholder}
                autoComplete="off"
                showPopperArrow={false}
                className="date-picker"
                customInput={
                  <TextField
                    variant="outlined"
                    label={label}
                    error={!!error}
                    helperText={error?.message || null}
                    value={inputValue} 
                    inputProps={{
                      maxLength: TIME_PICKER_MAX_LENGTH,
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
