import React, { useCallback, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { t } from 'i18next';
import { addDays, endOfDay, startOfDay } from 'date-fns';

import { StyledFlexColumn, StyledFlexTopCenter } from 'shared/styles/styledComponents/Flex';
import { StyledBodyLarge, theme } from 'shared/styles';

import { SelectController } from '../FormComponents';
import { DateRangePickerType, DateRangePickerFormValues } from './DateRangePicker.types';
import { getDateTypeOptions } from './DateRangePicker.utils';
import { DatePicker } from '../DatePicker';
import { DateType } from '../DatePicker/DatePicker.types';

interface DateRangePickerProps {
  'data-testid': string;
  maxDate: Date;
  minDate: Date;
}

export const DateRangePicker = ({
  'data-testid': dataTestid,
  maxDate,
  minDate,
}: DateRangePickerProps) => {
  const { control, setValue, watch } = useFormContext<DateRangePickerFormValues>();
  const dateType = watch('dateType');
  const fromDate = watch('fromDate');
  const toDate = watch('toDate');
  const hasCustomDate = dateType === DateRangePickerType.ChooseDates;

  const commonProps = {
    maxDate,
    control,
    inputSx: {
      '& .MuiInputLabel-outlined': {
        textTransform: 'capitalize',
      },
    },
  };

  const normalizeFromDate = useCallback(
    (date: DateType | undefined) => {
      if (!date) return;
      setValue('fromDate', startOfDay(date));
    },
    [setValue],
  );

  const normalizeToDate = useCallback(
    (date: DateType | undefined) => {
      if (!date) return;
      setValue('toDate', endOfDay(date));
    },
    [setValue],
  );

  const onFromDatePickerClose = () => {
    let newToDate = toDate;
    if (toDate < fromDate) {
      const increasedFromDate = addDays(fromDate, 1);

      newToDate = increasedFromDate <= maxDate ? increasedFromDate : maxDate;
    }
    normalizeToDate(newToDate);
  };

  useEffect(() => {
    switch (dateType) {
      case DateRangePickerType.AllTime:
        normalizeFromDate(minDate);
        normalizeToDate(maxDate);
        break;
      case DateRangePickerType.Last24h:
        setValue('fromDate', addDays(maxDate, -1));
        setValue('toDate', maxDate);
        break;
      case DateRangePickerType.LastWeek:
        normalizeFromDate(addDays(maxDate, -7));
        normalizeToDate(maxDate);
        break;
      case DateRangePickerType.LastMonth:
        normalizeFromDate(addDays(maxDate, -30));
        normalizeToDate(maxDate);
        break;
      case DateRangePickerType.ChooseDates:
        normalizeFromDate(minDate);
        normalizeToDate(maxDate);
        break;
    }
  }, [dateType, minDate, maxDate, normalizeFromDate, normalizeToDate, setValue]);

  return (
    <>
      <StyledFlexColumn sx={{ gap: 1.6 }}>
        <SelectController
          name="dateType"
          control={control}
          options={getDateTypeOptions()}
          label={t('dateRange')}
          data-testid={`${dataTestid}-date-range-picker`}
          fullWidth
        />
      </StyledFlexColumn>
      {hasCustomDate && (
        <StyledFlexTopCenter>
          <DatePicker
            {...commonProps}
            name="fromDate"
            onCloseCallback={(date) => {
              normalizeFromDate(date);
              onFromDatePickerClose();
            }}
            minDate={minDate}
            label={t('startDate')}
            data-testid={`${dataTestid}-from-date`}
            inputWrapperSx={{ width: '100%' }}
          />
          <StyledBodyLarge sx={{ margin: theme.spacing(0, 0.8) }}>{t('smallTo')}</StyledBodyLarge>
          <DatePicker
            {...commonProps}
            name="toDate"
            onCloseCallback={normalizeToDate}
            minDate={fromDate}
            label={t('endDate')}
            data-testid={`${dataTestid}-to-date`}
            inputWrapperSx={{ width: '100%' }}
          />
        </StyledFlexTopCenter>
      )}
    </>
  );
};
