import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';

import { Svg } from 'components/Svg';
import { ToggleButtonGroup } from 'components/ToggleButtonGroup';
import { TimePicker } from 'components/TimePicker';
import theme from 'styles/theme';
import { StyledLabelLarge } from 'styles/styledComponents/Typography';

import {
  FormValues,
  SendNotification,
  SendNotificationType,
} from '../../CreateActivityPopup.types';
import {
  StyledClose,
  StyledLogo,
  StyledNotification,
  StyledTimePickerContainer,
} from './Notification.styles';
import { getNotificationTimeToggles } from './Notification.utils';
import { NotificationProps, NotificationTimeType } from './Notification.types';

export const Notification = ({ type, timeAt, timeFrom, timeTo, index }: NotificationProps) => {
  const { t } = useTranslation('app');
  const notificationsTimeToggles = getNotificationTimeToggles(t);

  const { watch, setValue } = useFormContext<FormValues>();
  const notifications = watch('notifications');
  const { sendNotifications } = notifications;

  const handleRemoveNotification = () => {
    const newNotifications = {
      ...notifications,
      sendNotifications: sendNotifications?.filter((_, i) => i !== index) || null,
    };

    setValue('notifications', newNotifications);
  };

  const handleSetTime = (time: Date | undefined | null, type: NotificationTimeType) => {
    if (time) {
      let newNotification: SendNotification = { type: SendNotificationType.fixed, timeAt: time };
      if (type === NotificationTimeType.timeFrom) {
        const timeTo = sendNotifications?.[index].timeTo;
        newNotification = {
          type: SendNotificationType.random,
          timeTo,
          timeFrom: time,
        };
      }
      if (type === NotificationTimeType.timeTo) {
        const timeFrom = sendNotifications?.[index].timeFrom;
        newNotification = {
          type: SendNotificationType.random,
          timeFrom,
          timeTo: time,
        };
      }
      const newNotifications = {
        ...notifications,
        sendNotifications:
          sendNotifications?.map((item, i) => {
            if (i === index) {
              return newNotification;
            }

            return item;
          }) || null,
      };

      setValue('notifications', newNotifications);
    }
  };

  const handleSetNotificationType = (value: string) => {
    let newNotification: SendNotification = {
      type: SendNotificationType.fixed,
      timeAt: null,
    };
    if (value === SendNotificationType.random) {
      newNotification = {
        type: SendNotificationType.random,
        timeTo: null,
        timeFrom: null,
      };
    }
    const newNotifications = {
      ...notifications,
      sendNotifications:
        sendNotifications?.map((item, i) => {
          if (i === index) {
            return newNotification;
          }

          return item;
        }) || null,
    };

    setValue('notifications', newNotifications);
  };

  return (
    <>
      <StyledLabelLarge sx={{ margin: theme.spacing(1.2, 0) }}>{`${t('notification')} ${
        index + 1
      }`}</StyledLabelLarge>
      <StyledNotification>
        <Box>
          <StyledLogo>
            <Svg id="mind-logger-logo" />
            <StyledLabelLarge sx={{ marginLeft: theme.spacing(1) }}>MindLogger</StyledLabelLarge>
          </StyledLogo>
          <ToggleButtonGroup
            toggleButtons={notificationsTimeToggles}
            activeButton={type}
            setActiveButton={handleSetNotificationType}
          />
        </Box>
        <StyledTimePickerContainer>
          {type === SendNotificationType.fixed ? (
            <TimePicker
              value={timeAt}
              setValue={(time) => handleSetTime(time, NotificationTimeType.timeAt)}
              label={t('at')}
              width={13}
            />
          ) : (
            <>
              <TimePicker
                value={timeFrom}
                setValue={(time) => handleSetTime(time, NotificationTimeType.timeFrom)}
                label={t('from')}
                width={13}
              />
              <TimePicker
                value={timeTo}
                setValue={(time) => handleSetTime(time, NotificationTimeType.timeTo)}
                label={t('to')}
                width={13}
              />
            </>
          )}
        </StyledTimePickerContainer>
        <StyledClose onClick={handleRemoveNotification}>
          <Svg id="cross" />
        </StyledClose>
      </StyledNotification>
    </>
  );
};
