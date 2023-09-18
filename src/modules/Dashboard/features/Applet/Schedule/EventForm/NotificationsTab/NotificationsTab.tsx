import { useFormContext, useFieldArray } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Svg } from 'shared/components';
import { theme, StyledTitleMedium } from 'shared/styles';
import { NotificationType } from 'modules/Dashboard/api';

import { EventFormValues } from '../EventForm.types';
import { Notification } from './Notification';
import { Reminder } from './Reminder';
import { StyledRow, StyledAddBtn, StyledRowHeader } from './NotificationsTab.styles';
import { NotificationsTabProps } from './NotificationsTab.types';

export const NotificationsTab = ({ 'data-testid': dataTestid }: NotificationsTabProps) => {
  const { t } = useTranslation('app');
  const { setValue, control, watch } = useFormContext<EventFormValues>();
  const {
    fields: notifications,
    append,
    remove,
  } = useFieldArray({
    control,
    name: 'notifications',
  });
  const reminder = watch('reminder');
  const startTime = watch('startTime');

  const handleAddNotification = () => {
    append({
      atTime: startTime,
      triggerType: NotificationType.Fixed,
    });
  };

  const handleAddReminder = () => {
    setValue('reminder', {
      activityIncomplete: 0,
      reminderTime: startTime,
    });
  };

  return (
    <>
      <StyledRowHeader>
        <Svg id="alert" width="16" height="20" />
        <StyledTitleMedium sx={{ marginLeft: theme.spacing(1.5) }}>
          {t('sendNotifications')}
        </StyledTitleMedium>
      </StyledRowHeader>
      {notifications?.map((item, index) => (
        <Notification
          key={item.id}
          index={index}
          remove={remove}
          data-testid={`${dataTestid}-notification-${index}`}
        />
      ))}
      <StyledAddBtn
        variant="text"
        startIcon={<Svg width="18" height="18" id="add" />}
        onClick={handleAddNotification}
        data-testid={`${dataTestid}-add-notification`}
      >
        {t('addNotification')}
      </StyledAddBtn>
      <StyledRow>
        <StyledRowHeader>
          <Svg id="clock" width="20" height="20" />
          <StyledTitleMedium sx={{ marginLeft: theme.spacing(1.5) }}>
            {t('sendReminder')}
          </StyledTitleMedium>
        </StyledRowHeader>
        {reminder ? (
          <Reminder data-testid={`${dataTestid}-reminder`} />
        ) : (
          <StyledAddBtn
            variant="text"
            startIcon={<Svg width="18" height="18" id="add" />}
            onClick={handleAddReminder}
            data-testid={`${dataTestid}-add-reminder`}
          >
            {t('addReminder')}
          </StyledAddBtn>
        )}
      </StyledRow>
    </>
  );
};
