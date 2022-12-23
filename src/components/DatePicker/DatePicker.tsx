import { MouseEventHandler, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReactDatePicker from 'react-datepicker';

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
import { DateVariant, DatePickerProps, UiType, MinMaxDate } from './DatePicker.types';
import { DatePickerHeader } from './DatePickerHeader';
import { getDatesStringsArray, getStringFromDate, getDateFromString } from './DatePicker.utils';
import { datePlaceholder } from './DatePicker.const';

export const DatePicker = ({ value, setValue, uiType = UiType.oneDate }: DatePickerProps) => {
  const { t } = useTranslation('app');
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [showFirstCalendar, setShowFirstCalendar] = useState(true);
  const [showSecondCalendar, setShowSecondCalendar] = useState(false);

  const open = Boolean(anchorEl);
  const id = open ? 'date-picker-popover' : undefined;
  const handlePickerShow: MouseEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault();
    setAnchorEl(event.currentTarget);
  };
  const handlePickerClose = () => setAnchorEl(null);
  const handleCancelClick = () => {
    setValue('');
    handlePickerClose();
  };

  const handleShowFirstClick = () => {
    setShowFirstCalendar((prevState) => !prevState);
    setShowSecondCalendar(false);
  };

  const handleShowSecondClick = () => {
    setShowFirstCalendar(false);
    setShowSecondCalendar((prevState) => !prevState);
  };

  const handleDateChange = (date: Date | null, variant?: DateVariant) => {
    if (uiType === UiType.oneDate) {
      setValue(date ? getStringFromDate(date) : '');
    } else {
      const valueArr = getDatesStringsArray(value);
      if (date) {
        const startDate = variant === 'start' ? getStringFromDate(date) : valueArr?.[0];
        const endDate = variant === 'end' ? getStringFromDate(date) : valueArr?.[1];

        setValue(`${startDate || datePlaceholder} - ${endDate || datePlaceholder}`);
      }
    }
  };

  const getSelectedDate = (variant?: DateVariant) => {
    if (uiType === UiType.oneDate) {
      return value ? getDateFromString(value) : new Date();
    } else {
      let resultVal = new Date();
      const valueArr = value !== '' && getDatesStringsArray(value);
      if (valueArr) {
        if (variant === 'start') {
          resultVal = valueArr[0] !== datePlaceholder ? getDateFromString(valueArr[0]) : new Date();
        } else {
          resultVal = valueArr[1] !== datePlaceholder ? getDateFromString(valueArr[1]) : new Date();
        }
      }

      return resultVal;
    }
  };

  const getMinMaxDate = (type: MinMaxDate) => {
    const valueArr = value !== '' && getDatesStringsArray(value);
    if (valueArr) {
      const dateToUse = type === 'min' ? valueArr[0] : valueArr[1];

      return dateToUse !== datePlaceholder ? getDateFromString(dateToUse) : undefined;
    }
  };

  const getDayPickerCalendar = (variant?: DateVariant) => (
    <ReactDatePicker
      selected={getSelectedDate(variant)}
      onChange={(date) => handleDateChange(date, variant)}
      inline
      formatWeekDay={(nameOfDay) => nameOfDay.slice(0, 1)}
      renderCustomHeader={(props) => <DatePickerHeader uiType={uiType} {...props} />}
      minDate={variant === 'end' ? getMinMaxDate('min') : undefined}
      maxDate={variant === 'start' ? getMinMaxDate('max') : undefined}
    />
  );

  return (
    <>
      <StyledTextField
        disabled
        variant="outlined"
        label={uiType === UiType.oneDate ? t('date') : t('startingEndingDate')}
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
        {uiType === UiType.oneDate ? (
          getDayPickerCalendar()
        ) : (
          <>
            <StyledCollapseBtn
              sx={{
                backgroundColor: showFirstCalendar
                  ? variables.palette.surface_variant
                  : 'transparent',
              }}
              onClick={handleShowFirstClick}
            >
              <StyledBodyLarge fontWeight="regular" color={variables.palette.on_surface}>
                {t('selectStartingDate')}
              </StyledBodyLarge>
            </StyledCollapseBtn>
            {showFirstCalendar && getDayPickerCalendar('start')}
            <StyledCollapseBtn
              sx={{
                backgroundColor: showSecondCalendar
                  ? variables.palette.surface_variant
                  : 'transparent',
              }}
              onClick={handleShowSecondClick}
            >
              <StyledBodyLarge fontWeight="regular" color={variables.palette.on_surface}>
                {t('selectEndingDate')}
              </StyledBodyLarge>
            </StyledCollapseBtn>
            {showSecondCalendar && getDayPickerCalendar('end')}
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
};
