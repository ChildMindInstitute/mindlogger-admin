import { MouseEventHandler, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReactDatePicker from 'react-datepicker';
import { Controller, FieldValues } from 'react-hook-form';

import { Svg } from 'components';

import {
  StyledButton,
  StyledButtons,
  StyledIconBtn,
  StyledPopover,
  StyledTextField,
} from './DatePicker.styles';
import { DatePickerProps, DateVariant, UiType } from './DatePicker.types';
import { DatePickerHeader } from './DatePickerHeader';
import { getStringFromDate } from './DatePicker.utils';
import { DATE_PLACEHOLDER } from './DatePicker.const';
import { PopoverHeader } from './PopoverHeader';

export const DatePicker = <T extends FieldValues>({
  control,
  name,
  uiType = UiType.oneDate,
}: DatePickerProps<T>) => {
  const { t } = useTranslation('app');
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const open = Boolean(anchorEl);
  const id = open ? 'date-picker-popover' : undefined;
  const isStartEndingDate = uiType === UiType.startEndingDate;

  const handlePickerShow: MouseEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault();
    setAnchorEl(event.currentTarget);
  };

  const handlePickerClose = () => setAnchorEl(null);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => {
        const getSelectedDate = (variant?: DateVariant) => {
          if (isStartEndingDate) {
            if (variant === DateVariant.end) {
              return value[1] || null;
            }

            return value[0];
          }

          return value;
        };

        const getValue = () => {
          if (value && isStartEndingDate) {
            return `${getStringFromDate(value[0]) || DATE_PLACEHOLDER} - ${
              getStringFromDate(value[1]) || DATE_PLACEHOLDER
            }`;
          }

          return getStringFromDate(value) || '';
        };

        return (
          <>
            <StyledTextField
              disabled
              variant="outlined"
              label={uiType === UiType.oneDate ? t('date') : t('startEndDate')}
              value={getValue()}
              onClick={handlePickerShow}
              className={(open && 'active') || ''}
              InputProps={{
                endAdornment: (
                  <StyledIconBtn aria-describedby={id}>
                    <Svg id="schedule-outlined" />
                  </StyledIconBtn>
                ),
              }}
            />
            <StyledPopover
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={handlePickerClose}
              anchorOrigin={{
                vertical: 'center',
                horizontal: 'center',
              }}
              transformOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
              }}
            >
              {value && <PopoverHeader uiType={uiType} date={value} />}
              <ReactDatePicker
                renderCustomHeader={(props) => <DatePickerHeader uiType={uiType} {...props} />}
                startDate={isStartEndingDate && getSelectedDate()}
                endDate={isStartEndingDate && getSelectedDate(DateVariant.end)}
                selectsRange={isStartEndingDate}
                inline
                selected={getSelectedDate()}
                onChange={(date) => onChange(date)}
                monthsShown={isStartEndingDate ? 2 : 1}
                formatWeekDay={(nameOfDay) => nameOfDay[0]}
                minDate={new Date()}
              />
              <StyledButtons>
                <StyledButton variant="text" onClick={handlePickerClose}>
                  {t('cancel')}
                </StyledButton>
                <StyledButton variant="text" onClick={handlePickerClose}>
                  {t('ok')}
                </StyledButton>
              </StyledButtons>
            </StyledPopover>
          </>
        );
      }}
    />
  );
};
