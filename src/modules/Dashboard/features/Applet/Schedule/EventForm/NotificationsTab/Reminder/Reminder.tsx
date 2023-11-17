import { useTranslation } from 'react-i18next';
import { useFormContext, useWatch } from 'react-hook-form';

import { DatePicker, TimePicker } from 'shared/components';
import { InputController } from 'shared/components/FormComponents';
import { theme, StyledLabelLarge, StyledFlexTopStart, StyledBodyMedium } from 'shared/styles';
import { Periodicity } from 'modules/Dashboard/api';

import { EventFormValues } from '../../EventForm.types';
import { getNextDayComparison } from '../../EventForm.utils';
import { Header } from '../Header';
import { StyledColInner, StyledNotificationWrapper } from '../NotificationsTab.styles';
import { StyledReminder, StyledInputWrapper } from './Reminder.styles';
import { ReminderProps } from './Reminder.types';

export const Reminder = ({ 'data-testid': dataTestid }: ReminderProps) => {
  const { t } = useTranslation('app');
  const { setValue, control } = useFormContext<EventFormValues>();

  const [periodicity, startDate, startTime, endTime] = useWatch({
    control,
    name: ['periodicity', 'startDate', 'startTime', 'endTime'],
  });
  const isOncePeriodicity = periodicity === Periodicity.Once;
  const isWeekdaysPeriodicity = periodicity === Periodicity.Weekdays;
  const isMonthlyPeriodicity = periodicity === Periodicity.Monthly;
  const isCrossDayEvent = getNextDayComparison(startTime, endTime);

  const handleRemoveReminder = () => {
    setValue('reminder', null);
  };

  const minDate = typeof startDate === 'string' ? null : startDate;

  return (
    <StyledNotificationWrapper>
      <StyledLabelLarge sx={{ margin: theme.spacing(1.2, 0, 0, 1.1) }}>
        {t('reminder')}
      </StyledLabelLarge>
      <StyledReminder>
        <Header onClickHandler={handleRemoveReminder} data-testid={dataTestid} />
        <StyledFlexTopStart>
          <StyledInputWrapper>
            {isMonthlyPeriodicity ? (
              <DatePicker
                name="reminder.activityIncompleteDate"
                key="activityIncompleteDate"
                minDate={minDate}
                control={control}
                label={t('activityIncomplete')}
                // includeDates={submitDates}
                data-testid={`${dataTestid}-activity-incomplete-monthly-date`}
              />
            ) : (
              <InputController
                label={t('activityIncomplete')}
                type="number"
                name="reminder.activityIncomplete"
                control={control}
                InputProps={{ inputProps: { min: 0 } }}
                textAdornment="day"
                tooltip={t('numberOfConsecutiveDays')}
                minNumberValue={0}
                disabled={isOncePeriodicity && !isCrossDayEvent}
                data-testid={`${dataTestid}-activity-incomplete`}
              />
            )}
          </StyledInputWrapper>
          <StyledColInner>
            <TimePicker
              name="reminder.reminderTime"
              label={t('reminderTime')}
              data-testid={`${dataTestid}-reminder-time`}
            />
          </StyledColInner>
        </StyledFlexTopStart>
        {isWeekdaysPeriodicity && (
          <StyledBodyMedium sx={{ mt: theme.spacing(2) }}>
            {t('weekdaysReminderMessage')}
          </StyledBodyMedium>
        )}
      </StyledReminder>
    </StyledNotificationWrapper>
  );
};
