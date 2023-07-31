import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

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

export const AvailabilityTab = ({ hasAlwaysAvailableOption }: AvailabilityTabProps) => {
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

  const datePicker = (
    <StyledDatePickerWrapper>
      <DatePicker
        name={isOncePeriodicity ? 'date' : 'startDate'}
        value={isOncePeriodicity ? date : startDate}
        control={control}
        label={isOncePeriodicity ? t('date') : t('startDate')}
      />
      {!isOncePeriodicity && (
        <>
          <StyledBodyLarge sx={{ m: theme.spacing(0, 2.4) }}>
            {t('to').toLowerCase()}
          </StyledBodyLarge>
          <DatePicker name="endDate" value={endDate} control={control} label={t('endDate')} />
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
            />
          </StyledWrapper>
          <StyledTimeRow>
            <StyledTimeWrapper>
              <TimePicker name="startTime" control={control} label={t('from')} />
            </StyledTimeWrapper>
            <StyledTimeWrapper sx={{ marginLeft: theme.spacing(2.4) }}>
              <TimePicker name="endTime" control={control} label={t('to')} />
            </StyledTimeWrapper>
          </StyledTimeRow>
          <StyledWrapper>
            <CheckboxController
              disabled={startTime === '00:00'}
              name="accessBeforeSchedule"
              control={control}
              label={<StyledBodyMedium>{t('allowAccessBeforeTime')}</StyledBodyMedium>}
            />
          </StyledWrapper>
          {datePicker}
        </>
      )}
    </>
  );
};
