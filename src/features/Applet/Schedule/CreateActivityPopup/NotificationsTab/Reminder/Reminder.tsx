import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';

import { TimePicker } from 'components';
import { InputController } from 'components/FormComponents';
import { StyledLabelLarge } from 'styles/styledComponents/Typography';
import theme from 'styles/theme';
import { StyledFlexTopCenter } from 'styles/styledComponents/Flex';
import { FormValues } from 'features/Applet/Schedule/CreateActivityPopup';

import { StyledReminder, StyledInputWrapper } from './Reminder.styles';
import { Header } from '../Header';
import { StyledColInner, StyledNotificationWrapper } from '../NotificationsTab.styles';

export const Reminder = () => {
  const { t } = useTranslation('app');
  const { setValue, control } = useFormContext<FormValues>();

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
        <StyledFlexTopCenter>
          <StyledInputWrapper>
            <InputController
              label={t('activityIncomplete')}
              type="number"
              name="reminder.activityIncomplete"
              control={control}
              InputProps={{ inputProps: { min: 1 } }}
              textAdornment="day"
              tooltip={t('numberOfConsecutiveDays')}
            />
          </StyledInputWrapper>
          <StyledColInner>
            <TimePicker name="reminder.reminderTime" label={t('reminderTime')} />
          </StyledColInner>
        </StyledFlexTopCenter>
      </StyledReminder>
    </StyledNotificationWrapper>
  );
};
