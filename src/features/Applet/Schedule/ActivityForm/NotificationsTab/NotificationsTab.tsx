import { useFormContext, useFieldArray } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Svg } from 'components/Svg';
import theme from 'styles/theme';
import { StyledTitleMedium } from 'styles/styledComponents/Typography';

import { StyledRow, StyledAddBtn, StyledRowHeader } from './NotificationsTab.styles';
import { Notification } from './Notification';
import { FormValues } from '../';
import { Reminder } from './Reminder';

export const NotificationsTab = () => {
  const { t } = useTranslation('app');
  const { setValue, control, watch } = useFormContext<FormValues>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'notifications',
  });
  const reminder = watch('reminder');

  const handleAddNotification = () => {
    append({
      at: null,
    });
  };

  const handleAddReminder = () => {
    setValue('reminder', {
      activityIncomplete: 1,
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
