import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { addDays } from 'date-fns';

import { CheckboxController, SelectController } from 'shared/components/FormComponents';
import { TimePicker, DatePicker, ToggleButtonGroup } from 'shared/components';
import { theme, variables, StyledBodyMedium, StyledBodyLarge } from 'shared/styles';
import { Periodicity } from 'modules/Dashboard/api';

import { EventFormValues } from '../EventForm.types';
import { DEFAULT_START_TIME } from '../EventForm.const';
import { repeatsButtons } from './Availability.const';
import {
  StyledButtonsTitle,
  StyledTimeRow,
  StyledTimeWrapper,
  StyledWrapper,
  StyledDatePickerWrapper,
} from './AvailabilityTab.styles';
import { AvailabilityTabProps } from './AvailabilityTab.types';
import { getAvailabilityOptions } from './AvailabilityTab.utils';

export const AvailabilityTab = ({
  hasAlwaysAvailableOption,
  'data-testid': dataTestid,
}: AvailabilityTabProps) => {
  const { t } = useTranslation('app');
  const { control, watch, setValue } = useFormContext<EventFormValues>();
  const alwaysAvailable = watch('alwaysAvailable');
  const periodicity = watch('periodicity');
  const date = watch('date');
  const startDate = watch('startDate');
  const endDate = watch('endDate');
  const startTime = watch('startTime');
  const removeWarning = watch('removeWarning');
  const isOncePeriodicity = periodicity === Periodicity.Once;

  const handleSetPeriodicity = (period: string | number) =>
    setValue('periodicity', period as Periodicity);

  const onCloseCallback = () => {
    if (typeof startDate !== 'string' && startDate && endDate && endDate < startDate) {
      setValue('endDate', addDays(startDate, 1));
    }
  };

  const datePicker = (
    <StyledDatePickerWrapper>
      <DatePicker
        name={isOncePeriodicity ? 'date' : 'startDate'}
        value={isOncePeriodicity ? date : startDate}
        control={control}
        label={isOncePeriodicity ? t('date') : t('startDate')}
        onCloseCallback={onCloseCallback}
        data-testid={`${dataTestid}-start-date`}
      />
      {!isOncePeriodicity && (
        <>
          <StyledBodyLarge sx={{ m: theme.spacing(0, 2.4) }}>
            {t('to').toLowerCase()}
          </StyledBodyLarge>
          <DatePicker
            name="endDate"
            minDate={typeof startDate === 'string' ? null : startDate}
            value={endDate}
            control={control}
            label={t('endDate')}
            data-testid={`${dataTestid}-end-date`}
          />
        </>
      )}
    </StyledDatePickerWrapper>
  );

  useEffect(() => {
    if (startTime === DEFAULT_START_TIME) {
      setValue('accessBeforeSchedule', false);
    }
  }, [startTime]);

  return (
    <>
      <SelectController
        name="alwaysAvailable"
        fullWidth
        options={getAvailabilityOptions(hasAlwaysAvailableOption)}
        control={control}
        data-testid={`${dataTestid}-always-available`}
      />
      {Object.keys(removeWarning).length !== 0 && (
        <StyledBodyMedium sx={{ marginLeft: theme.spacing(1.6) }} color={variables.palette.primary}>
          {removeWarning.showRemoveAlwaysAvailable && t('scheduledAccessWarning')}
          {removeWarning.showRemoveAllScheduled && t('alwaysAvailableWarning')}
        </StyledBodyMedium>
      )}
      {alwaysAvailable ? (
        <StyledWrapper>
          <CheckboxController
            name="oneTimeCompletion"
            control={control}
            label={<StyledBodyMedium>{t('oneTimeCompletion')}</StyledBodyMedium>}
            data-testid={`${dataTestid}-one-time-completion`}
          />
        </StyledWrapper>
      ) : (
        <>
          <StyledWrapper>
            <StyledButtonsTitle>{t('usersCanAccessActivity')}</StyledButtonsTitle>
            <ToggleButtonGroup
              toggleButtons={repeatsButtons}
              activeButton={periodicity}
              setActiveButton={handleSetPeriodicity}
              data-testid={`${dataTestid}-periodicity`}
            />
          </StyledWrapper>
          <StyledTimeRow>
            <StyledTimeWrapper>
              <TimePicker
                name="startTime"
                control={control}
                label={t('from')}
                data-testid={`${dataTestid}-start-time`}
              />
            </StyledTimeWrapper>
            <StyledTimeWrapper sx={{ marginLeft: theme.spacing(2.4) }}>
              <TimePicker
                name="endTime"
                control={control}
                label={t('to')}
                data-testid={`${dataTestid}-end-time`}
              />
            </StyledTimeWrapper>
          </StyledTimeRow>
          <StyledWrapper isCheckboxDisabled={startTime === '00:00'}>
            <CheckboxController
              name="accessBeforeSchedule"
              control={control}
              label={<StyledBodyMedium>{t('allowAccessBeforeTime')}</StyledBodyMedium>}
              data-testid={`${dataTestid}-access-before-schedule`}
            />
          </StyledWrapper>
          {datePicker}
        </>
      )}
    </>
  );
};
