import { useFormContext, useFieldArray, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { NotificationType, Periodicity } from 'modules/Dashboard/api';
import { Svg } from 'shared/components/Svg';
import { theme, StyledTitleMedium, variables } from 'shared/styles';

import { DEFAULT_ACTIVITY_INCOMPLETE_VALUE, DEFAULT_REMINDER_TIME } from '../EventForm.const';
import { EventFormValues } from '../EventForm.types';
import { Notification } from './Notification';
import { StyledRow, StyledAddBtn, StyledRowHeader } from './NotificationsTab.styles';
import { NotificationsTabProps } from './NotificationsTab.types';
import { Reminder } from './Reminder';

export const NotificationsTab = ({ 'data-testid': dataTestid }: NotificationsTabProps) => {
  const { t } = useTranslation('app');
  const { setValue, control } = useFormContext<EventFormValues>();
  const {
    fields: notifications,
    append,
    remove,
  } = useFieldArray({
    control,
    name: 'notifications',
  });

  const [periodicity, startTime, reminder] = useWatch({
    control,
    name: ['periodicity', 'startTime', 'reminder'],
  });

  const isAlwaysAvailable = periodicity === Periodicity.Always;

  const handleAddNotification = () => {
    append({
      atTime: startTime,
      triggerType: NotificationType.Fixed,
    });
  };

  const handleAddReminder = () => {
    setValue(
      'reminder',
      {
        activityIncomplete: DEFAULT_ACTIVITY_INCOMPLETE_VALUE,
        reminderTime: isAlwaysAvailable ? DEFAULT_REMINDER_TIME : startTime,
      },
      { shouldDirty: true },
    );
  };

  return (
    <>
      <StyledRowHeader>
        <Svg id="alert" width="16" height="20" />
        <StyledTitleMedium sx={{ color: variables.palette.on_surface, marginLeft: theme.spacing(1.5) }}>
          {t('sendNotifications')}
        </StyledTitleMedium>
      </StyledRowHeader>
      {notifications?.map((item, index) => (
        <Notification key={item.id} index={index} remove={remove} data-testid={`${dataTestid}-notification-${index}`} />
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
          <StyledTitleMedium sx={{ color: variables.palette.on_surface, marginLeft: theme.spacing(1.5) }}>
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
