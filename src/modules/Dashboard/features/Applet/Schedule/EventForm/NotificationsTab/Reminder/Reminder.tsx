import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';

import { TimePicker } from 'shared/components';
import { InputController } from 'shared/components/FormComponents';
import { theme, StyledLabelLarge, StyledFlexTopStart } from 'shared/styles';

import { EventFormValues } from '../../EventForm.types';
import { Header } from '../Header';
import { StyledColInner, StyledNotificationWrapper } from '../NotificationsTab.styles';
import { StyledReminder, StyledInputWrapper } from './Reminder.styles';

export const Reminder = () => {
  const { t } = useTranslation('app');
  const { setValue, control } = useFormContext<EventFormValues>();

  const handleARemoveReminder = () => {
    setValue('reminder', null);
  };

  return (
    <StyledNotificationWrapper>
      <StyledLabelLarge sx={{ margin: theme.spacing(1.2, 0, 0, 1.1) }}>
        {t('reminder')}
      </StyledLabelLarge>
      <StyledReminder>
        <Header onClickHandler={handleARemoveReminder} />
        <StyledFlexTopStart>
          <StyledInputWrapper>
            <InputController
              label={t('activityIncomplete')}
              type="number"
              name="reminder.activityIncomplete"
              control={control}
              InputProps={{ inputProps: { min: 0 } }}
              textAdornment="day"
              tooltip={t('numberOfConsecutiveDays')}
              minNumberValue={0}
            />
          </StyledInputWrapper>
          <StyledColInner>
            <TimePicker name="reminder.reminderTime" label={t('reminderTime')} />
          </StyledColInner>
        </StyledFlexTopStart>
      </StyledReminder>
    </StyledNotificationWrapper>
  );
};
