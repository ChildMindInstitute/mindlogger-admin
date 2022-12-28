import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';

import { TimePicker } from 'components/TimePicker';
import { InputController } from 'components/FormComponents';

import { FormValues } from '../../CreateActivityPopup.types';
import { StyledReminder, StyledInputWrapper } from './Reminder.styles';

export const Reminder = ({ reminderTime }: { reminderTime: Date | null }) => {
  const { t } = useTranslation('app');

  const { watch, setValue, control } = useFormContext<FormValues>();
  const notifications = watch('notifications');
  const { sendReminder } = notifications;

  const handleSetTime = (reminderTime: Date | undefined | null) => {
    if (reminderTime) {
      const activityIncomplete = sendReminder?.activityIncomplete || 1;
      const newNotifications = {
        ...notifications,
        sendReminder: { activityIncomplete, reminderTime },
      };

      setValue('notifications', newNotifications);
    }
  };

  return (
    <StyledReminder>
      <StyledInputWrapper>
        <InputController
          label={t('activityIncomplete')}
          type="number"
          name="notifications.sendReminder.activityIncomplete"
          control={control}
          InputProps={{ inputProps: { min: 1 } }}
          endTextAdornmentSingular={t('day')}
          endTextAdornmentPlural={t('days')}
        />
      </StyledInputWrapper>
      <TimePicker
        value={reminderTime}
        setValue={handleSetTime}
        label={t('reminderTime')}
        width={26}
      />
    </StyledReminder>
  );
};
