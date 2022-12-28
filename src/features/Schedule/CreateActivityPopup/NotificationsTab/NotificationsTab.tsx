import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Svg } from 'components/Svg';
import theme from 'styles/theme';
import { StyledFlexTopCenter } from 'styles/styledComponents/Flex';
import { StyledBodyMedium, StyledTitleMedium } from 'styles/styledComponents/Typography';

import { StyledRow, StyledAddBtn } from './NotificationsTab.styles';
import { Notification } from './Notification';
import { FormValues, SendNotification, SendNotificationType } from '../CreateActivityPopup.types';
import { Reminder } from './Reminder';

export const NotificationsTab = () => {
  const { t } = useTranslation('app');
  const { setValue, watch } = useFormContext<FormValues>();
  const notifications = watch('notifications');
  const { sendNotifications, sendReminder } = notifications;

  const handleAddNotification = () => {
    const newNotifications = {
      ...notifications,
      sendNotifications: [
        ...(sendNotifications || []),
        {
          type: SendNotificationType.fixed,
          timeAt: null,
        },
      ],
    };

    setValue('notifications', newNotifications);
  };

  const handleAddReminder = () => {
    const newNotifications = {
      ...notifications,
      sendReminder: {
        activityIncomplete: 1,
        reminderTime: null,
      },
    };

    setValue('notifications', newNotifications);
  };

  return (
    <>
      <StyledBodyMedium>{t('setTheLimit')}:</StyledBodyMedium>
      <StyledRow>
        <StyledFlexTopCenter>
          <Svg id="alert" width="16" height="20" />
          <StyledTitleMedium sx={{ marginLeft: theme.spacing(1.6) }}>
            {t('sendNotifications')}
          </StyledTitleMedium>
        </StyledFlexTopCenter>
        {sendNotifications?.map((item: SendNotification, index: number) => (
          <Notification key={index} index={index} {...item} />
        ))}
        <StyledAddBtn
          variant="text"
          startIcon={<Svg width="18" height="18" id="add" />}
          onClick={handleAddNotification}
        >
          {t('addNotification')}
        </StyledAddBtn>
      </StyledRow>
      <StyledRow>
        <StyledFlexTopCenter>
          <Svg id="clock" width="20" height="20" />
          <StyledTitleMedium sx={{ marginLeft: theme.spacing(1.3) }}>
            {t('sendReminder')}
          </StyledTitleMedium>
        </StyledFlexTopCenter>
        {sendReminder && <Reminder {...sendReminder} />}
        {!sendReminder && (
          <StyledAddBtn
            variant="text"
            startIcon={<Svg width="18" height="18" id="add" />}
            onClick={handleAddReminder}
          >
            {t('addReminder')}
          </StyledAddBtn>
        )}
      </StyledRow>
    </>
  );
};
