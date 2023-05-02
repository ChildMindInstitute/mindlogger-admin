import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';

import { ToggleButtonGroup, TimePicker } from 'shared/components';
import { StyledFlexTopCenter, StyledLabelLarge, theme } from 'shared/styles';
import { NotificationType } from 'modules/Dashboard/api';

import { StyledNotification, StyledCol, StyledLeftCol } from './Notification.styles';
import { StyledColInner, StyledNotificationWrapper } from '../NotificationsTab.styles';
import { notificationTimeToggles } from './Notification.const';
import { Header } from '../Header';
import { NotificationProps } from './Notification.types';
import { EventFormValues } from '../../EventForm.types';

export const Notification = ({ index, remove }: NotificationProps) => {
  const { t } = useTranslation('app');
  const { setValue, watch } = useFormContext<EventFormValues>();
  const notification = watch(`notifications.${index}`);
  const startTime = watch('startTime');
  const endTime = watch('endTime');
  const atTime = watch(`notifications.${index}.atTime`);
  const fromTime = watch(`notifications.${index}.fromTime`);
  const toTime = watch(`notifications.${index}.toTime`);

  const handleRemoveNotification = () => {
    remove(index);
  };

  const updateTime = (selected: string) => {
    setValue(`notifications.${index}`, {
      atTime: selected === NotificationType.Fixed ? startTime : null,
      fromTime: selected === NotificationType.Random ? startTime : null,
      toTime: selected === NotificationType.Random ? endTime : null,
      triggerType: selected as NotificationType,
    });
  };

  return (
    <StyledNotificationWrapper>
      <StyledLabelLarge sx={{ margin: theme.spacing(0, 0, 1.2, 1.1) }}>
        {t('notification')} {index + 1}
      </StyledLabelLarge>
      <StyledNotification>
        <Header onClickHandler={handleRemoveNotification} />
        <StyledFlexTopCenter>
          <StyledLeftCol>
            <ToggleButtonGroup
              toggleButtons={notificationTimeToggles}
              activeButton={notification.triggerType}
              customChange={updateTime}
            />
          </StyledLeftCol>
          <StyledCol sx={{ marginLeft: theme.spacing(2.4) }}>
            {notification.triggerType === NotificationType.Fixed ? (
              <StyledColInner>
                <TimePicker
                  providedValue={atTime}
                  name={`notifications.${index}.atTime`}
                  label={t('at')}
                />
              </StyledColInner>
            ) : (
              <>
                <StyledColInner>
                  <TimePicker
                    providedValue={fromTime}
                    name={`notifications.${index}.fromTime`}
                    label={t('from')}
                  />
                </StyledColInner>
                <StyledColInner sx={{ marginLeft: theme.spacing(2.4) }}>
                  <TimePicker
                    providedValue={toTime}
                    name={`notifications.${index}.toTime`}
                    label={t('to')}
                  />
                </StyledColInner>
              </>
            )}
          </StyledCol>
        </StyledFlexTopCenter>
      </StyledNotification>
    </StyledNotificationWrapper>
  );
};
