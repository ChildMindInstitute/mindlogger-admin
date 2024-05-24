import { MouseEventHandler, lazy, useState, Suspense, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Controller, FieldValues } from 'react-hook-form';
import { fr } from 'date-fns/locale';

import { Spinner, SpinnerUiType } from 'shared/components/Spinner';
import { Tooltip } from 'shared/components/Tooltip';
import { StyledBodyLarge, theme } from 'shared/styles';

import {
  DatePickerFallback,
  StyledButton,
  StyledButtons,
  StyledCancelButton,
  StyledPopover,
  StyledSpan,
} from './DatePicker.styles';
import {
  DateType,
  DateArrayType,
  DatePickerProps,
  DateVariant,
  UiType,
  OnChangeRefType,
} from './DatePicker.types';
import { DatePickerHeader } from './DatePickerHeader';
import { getStringFromDate } from './DatePicker.utils';
import { DATE_PLACEHOLDER } from './DatePicker.const';
import { PopoverHeader } from './PopoverHeader';
import { DatePickerInput } from './DatePickerInput';

const ReactDatePicker = lazy(() => import('react-datepicker'));

export const DatePicker = <T extends FieldValues>({
  control,
  name,
  uiType = UiType.OneDate,
  inputWrapperSx = {},
  inputSx,
  label,
  includeDates,
  minDate,
  maxDate,
  onMonthChange,
  disabled,
  onCloseCallback,
  onSubmitCallback,
  isLoading,
  tooltip,
  'data-testid': dataTestid,
  placeholder = '',
  hideLabel = false,
}: DatePickerProps<T>) => {
  const { t, i18n } = useTranslation('app');
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const onChangeRef = useRef<OnChangeRefType>({
    callback: () => void 0,
    prevValue: void 0,
  });

  const open = Boolean(anchorEl);
  const isOpen = !disabled && open;
  const id = isOpen ? 'date-picker-popover' : undefined;
  const isStartEndingDate = uiType === UiType.StartEndingDate;

  const handlePickerShow: MouseEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault();
    setAnchorEl(event.currentTarget);
  };

  const handlePickerClose = (date?: DateType) => {
    onChangeRef.current.prevValue = date;
    onCloseCallback?.(date);
    setAnchorEl(null);
  };
  const handlePickerCancel = () => {
    onChangeRef.current.callback(onChangeRef.current.prevValue);
    setAnchorEl(null);
  };
  const handlePickerSubmit = (date: DateType) => () => {
    onSubmitCallback?.(date);
    handlePickerClose();
  };

  return (
    <Suspense>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value }, fieldState: { error } }) => {
          const singleDate = value as DateType;
          const startEndingValue = value as DateArrayType;
          onChangeRef.current.prevValue = onChangeRef.current.prevValue ?? singleDate;
          onChangeRef.current.callback = onChange;

          const getSelectedDate = (variant?: DateVariant) => {
            if (isStartEndingDate) {
              if (variant === DateVariant.End) {
                return startEndingValue[1] || null;
              }

              return startEndingValue[0];
            }

            return singleDate;
          };

          const getValue = () => {
            if (value && isStartEndingDate) {
              return [
                getStringFromDate(startEndingValue[0]) || DATE_PLACEHOLDER,
                getStringFromDate(startEndingValue[1]) || DATE_PLACEHOLDER,
              ];
            }

            return getStringFromDate(singleDate) || '';
          };

          const textFieldProps = {
            disabled,
            isOpen,
            inputWrapperSx,
            inputSx,
            error,
            id,
            handlePickerShow,
            dataTestid,
            placeholder,
            hideLabel,
          };

          const handleCloseWithSelectedDate = () => handlePickerClose(getSelectedDate());

          return (
            <>
              <Tooltip tooltipTitle={tooltip}>
                <StyledSpan>
                  {uiType === UiType.OneDate ? (
                    <DatePickerInput
                      {...textFieldProps}
                      label={label || t('date')}
                      value={getValue()}
                    />
                  ) : (
                    <>
                      <DatePickerInput
                        {...textFieldProps}
                        label={t('startDate')}
                        value={getValue()[0] || ''}
                        dataTestid={`${dataTestid}-start`}
                      />
                      <StyledBodyLarge sx={{ margin: theme.spacing(0, 0.8) }}>
                        {t('smallTo')}
                      </StyledBodyLarge>
                      <DatePickerInput
                        {...textFieldProps}
                        label={t('endDate')}
                        value={getValue()[1] || ''}
                        dataTestid={`${dataTestid}-end`}
                      />
                    </>
                  )}
                </StyledSpan>
              </Tooltip>
              <StyledPopover
                id={id}
                open={isOpen}
                anchorEl={anchorEl}
                onClose={handleCloseWithSelectedDate}
                anchorOrigin={{
                  vertical: 'center',
                  horizontal: 'center',
                }}
                transformOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center',
                }}
                data-testid={`${dataTestid}-popover`}
              >
                {isLoading && <Spinner uiType={SpinnerUiType.Secondary} />}
                {value && (
                  <PopoverHeader uiType={uiType} date={value as Date | Date[]} tooltip={tooltip} />
                )}
                <Suspense fallback={<DatePickerFallback />}>
                  <ReactDatePicker
                    locale={i18n.language === 'fr' ? fr : undefined}
                    renderCustomHeader={(props) => <DatePickerHeader uiType={uiType} {...props} />}
                    startDate={isStartEndingDate ? (getSelectedDate() as DateType) : undefined}
                    endDate={
                      isStartEndingDate ? (getSelectedDate(DateVariant.End) as DateType) : undefined
                    }
                    selectsRange={isStartEndingDate}
                    inline
                    selected={(getSelectedDate() as DateType) ?? onChangeRef.current.prevValue}
                    disabled={disabled}
                    onChange={(date) => onChange(date)}
                    monthsShown={isStartEndingDate ? 2 : 1}
                    formatWeekDay={(nameOfDay) => nameOfDay[0]}
                    minDate={minDate === undefined ? new Date() : minDate}
                    maxDate={maxDate === undefined ? null : maxDate}
                    focusSelectedMonth
                    onMonthChange={onMonthChange}
                    includeDates={includeDates}
                  />
                </Suspense>
                <StyledButtons>
                  <StyledCancelButton variant="text" onClick={handlePickerCancel}>
                    {t('cancel')}
                  </StyledCancelButton>
                  <StyledButton variant="text" onClick={handlePickerSubmit(getSelectedDate())}>
                    {t('ok')}
                  </StyledButton>
                </StyledButtons>
              </StyledPopover>
            </>
          );
        }}
      />
    </Suspense>
  );
};
