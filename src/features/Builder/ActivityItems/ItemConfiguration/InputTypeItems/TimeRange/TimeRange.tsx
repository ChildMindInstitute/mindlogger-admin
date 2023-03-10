import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FieldValues, useFormContext } from 'react-hook-form';

import { TimePicker } from 'components';
import theme from 'styles/theme';
import { StyledFlexTopStart } from 'styles/styledComponents';

import { ItemOptionContainer } from '../ItemOptionContainer';
import { TimeRangeProps } from './TimeRange.types';

const timePickerSxProps = {
  width: '30rem',
};

export const TimeRange = <T extends FieldValues>({ name, endTime }: TimeRangeProps<T>) => {
  const { t } = useTranslation('app');
  const { watch, setValue, control } = useFormContext();
  const start = watch(name);
  const end = watch(endTime);

  useEffect(() => {
    const shouldSkipRangeChange =
      !start || !end || start === end || new Date(start).getTime() <= new Date(end).getTime();
    if (shouldSkipRangeChange) return;

    setValue(endTime, start);
  }, [start]);

  useEffect(() => {
    const shouldSkipRangeChange =
      !start || !end || start === end || new Date(start).getTime() <= new Date(end).getTime();
    if (shouldSkipRangeChange) return;

    setValue(name, end);
  }, [end]);

  return (
    <ItemOptionContainer title={t('timeRangeTitle')}>
      <StyledFlexTopStart>
        <TimePicker
          label={t('startTime')}
          name={name}
          control={control}
          wrapperSx={{
            ...timePickerSxProps,
            mr: theme.spacing(2),
          }}
        />
        <TimePicker
          label={t('endTime')}
          name={endTime}
          control={control}
          wrapperSx={{
            ...timePickerSxProps,
          }}
        />
      </StyledFlexTopStart>
    </ItemOptionContainer>
  );
};
