import { useFormContext, useFieldArray } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Svg } from 'shared/components';
import { theme, StyledTitleMedium } from 'shared/styles';

import { EventFormValues, NotificationType } from '../EventForm.types';
import { Notification } from './Notification';
import { Reminder } from './Reminder';
import { StyledRow, StyledAddBtn, StyledRowHeader } from './NotificationsTab.styles';

export const NotificationsTab = () => {
  const { t } = useTranslation('app');
  const { setValue, control, watch } = useFormContext<EventFormValues>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'notifications',
  });
  const reminder = watch('reminder');

  const handleAddNotification = () => {
    append({
      atTime: null,
      triggerType: NotificationType.Fixed,
    });
  };

  const handleAddReminder = () => {
    setValue('reminder', {
      activityIncomplete: 0,
      reminderTime: null,
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
      {fields?.map((item, index) => (
        <Notification key={item.id} index={index} remove={remove} />
      ))}
      <StyledAddBtn
        variant="text"
        startIcon={<Svg width="18" height="18" id="add" />}
        onClick={handleAddNotification}
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
          <Reminder />
        ) : (
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
