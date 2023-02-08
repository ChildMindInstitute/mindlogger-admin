import { MouseEventHandler, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReactDatePicker from 'react-datepicker';
import { Controller, FieldValues } from 'react-hook-form';

import { Svg } from 'components/Svg';
import { variables } from 'styles/variables';
import { StyledBodyLarge } from 'styles/styledComponents/Typography';

import {
  StyledButton,
  StyledButtons,
  StyledCollapseBtn,
  StyledIconBtn,
  StyledPopover,
  StyledTextField,
} from './DatePicker.styles';
import { DatePickerProps, DateVariant, MinMaxDate, UiType } from './DatePicker.types';
import { DatePickerHeader } from './DatePickerHeader';
import { getDateFromString, getDatesStringsArray, getStringFromDate } from './DatePicker.utils';
import { DATE_PLACEHOLDER } from './DatePicker.const';

export const DatePicker = <T extends FieldValues>({
  control,
  name,
  uiType = UiType.OneDate,
}: DatePickerProps<T>) => {
  const { t } = useTranslation('app');
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [firstCalendarVisible, setFirstCalendarVisible] = useState(true);
  const [secondCalendarVisible, setSecondCalendarVisible] = useState(false);

  const open = Boolean(anchorEl);
  const id = open ? 'date-picker-popover' : undefined;

  const handlePickerShow: MouseEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault();
    setAnchorEl(event.currentTarget);
  };

  const handlePickerClose = () => setAnchorEl(null);

  const handleShowFirstClick = () => {
    setFirstCalendarVisible((prevState) => !prevState);
    setSecondCalendarVisible(false);
  };

  const handleShowSecondClick = () => {
    setFirstCalendarVisible(false);
    setSecondCalendarVisible((prevState) => !prevState);
  };

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => {
        const handleCancelClick = () => {
          onChange('');
          handlePickerClose();
        };

        const getDayPickerCalendar = (variant?: DateVariant) => (
          <ReactDatePicker
            selected={getSelectedDate(variant)}
            onChange={(date) => handleDateChange(date, variant)}
            inline
            formatWeekDay={(nameOfDay) => nameOfDay.slice(0, 1)}
            renderCustomHeader={(props) => <DatePickerHeader uiType={uiType} {...props} />}
            minDate={variant === DateVariant.End ? getMinMaxDate(MinMaxDate.Min) : undefined}
            maxDate={variant === DateVariant.Start ? getMinMaxDate(MinMaxDate.Max) : undefined}
          />
        );

        const handleDateChange = (date: Date | null, variant?: DateVariant) => {
          if (uiType === UiType.OneDate) {
            onChange(date ? getStringFromDate(date) : '');
          } else {
            const datesArr = getDatesStringsArray(value);
            if (date) {
              const startDate =
                variant === DateVariant.Start ? getStringFromDate(date) : datesArr?.[0];
              const endDate = variant === DateVariant.End ? getStringFromDate(date) : datesArr?.[1];

              onChange(`${startDate || DATE_PLACEHOLDER} - ${endDate || DATE_PLACEHOLDER}`);
            }
          }
        };

        const getSelectedDate = (variant?: DateVariant) => {
          if (uiType === UiType.OneDate) {
            return value ? getDateFromString(value) : new Date();
          } else {
            let selectedDate = new Date();
            const datesArr = value !== '' && getDatesStringsArray(value);
            if (datesArr) {
              const index = variant === DateVariant.Start ? 0 : 1;
              selectedDate =
                datesArr[index] !== DATE_PLACEHOLDER
                  ? getDateFromString(datesArr[index])
                  : new Date();
            }

            return selectedDate;
          }
        };

        const getMinMaxDate = (type: MinMaxDate) => {
          const datesArr = value !== '' && getDatesStringsArray(value);
          if (datesArr) {
            const dateToUse = type === MinMaxDate.Min ? datesArr[0] : datesArr[1];

            return dateToUse !== DATE_PLACEHOLDER ? getDateFromString(dateToUse) : undefined;
          }
        };

        return (
          <>
            <StyledTextField
              disabled
              variant="outlined"
              label={uiType === UiType.OneDate ? t('date') : t('startingEndingDate')}
              value={value}
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
                vertical: 'bottom',
                horizontal: 'left',
              }}
            >
              {uiType === UiType.OneDate ? (
                getDayPickerCalendar()
              ) : (
                <>
                  <StyledCollapseBtn
                    sx={{
                      backgroundColor: firstCalendarVisible
                        ? variables.palette.surface_variant
                        : 'transparent',
                    }}
                    onClick={handleShowFirstClick}
                  >
                    <StyledBodyLarge color={variables.palette.on_surface}>
                      {t('selectStartingDate')}
                    </StyledBodyLarge>
                  </StyledCollapseBtn>
                  {firstCalendarVisible && getDayPickerCalendar(DateVariant.Start)}
                  <StyledCollapseBtn
                    sx={{
                      backgroundColor: secondCalendarVisible
                        ? variables.palette.surface_variant
                        : 'transparent',
                    }}
                    onClick={handleShowSecondClick}
                  >
                    <StyledBodyLarge color={variables.palette.on_surface}>
                      {t('selectEndingDate')}
                    </StyledBodyLarge>
                  </StyledCollapseBtn>
                  {secondCalendarVisible && getDayPickerCalendar(DateVariant.End)}
                </>
              )}
              <StyledButtons>
                <StyledButton variant="text" onClick={handleCancelClick}>
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
