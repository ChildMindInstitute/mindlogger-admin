import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormContext, useWatch } from 'react-hook-form';

import { ToggleButtonGroup, TimePicker } from 'shared/components';
import { StyledFlexTopStart, StyledLabelLarge, theme } from 'shared/styles';
import { NotificationType } from 'modules/Dashboard/api';

import { StyledNotification, StyledCol, StyledLeftCol } from './Notification.styles';
import { StyledColInner, StyledNotificationWrapper } from '../NotificationsTab.styles';
import { notificationTimeToggles } from './Notification.const';
import { Header } from '../Header';
import { NotificationProps } from './Notification.types';

export const Notification = ({ index, remove, 'data-testid': dataTestid }: NotificationProps) => {
  const { t } = useTranslation('app');
  const { setValue, /*watch,*/ trigger, control } = useFormContext();

  const notificationFieldName = `notifications.${index}`;
  const atTimeFieldName = `${notificationFieldName}.atTime`;
  const fromTimeFieldName = `${notificationFieldName}.fromTime`;
  const toTimeFieldName = `${notificationFieldName}.toTime`;

  const [notification, startTime, endTime, atTime, fromTime, toTime] = useWatch({
    control,
    name: [
      notificationFieldName,
      'startTime',
      'endTime',
      atTimeFieldName,
      fromTimeFieldName,
      toTimeFieldName,
    ],
  });

  // const notification = watch(notificationFieldName);
  // const startTime = watch('startTime');
  // const endTime = watch('endTime');
  // const atTime = watch(atTimeFieldName);
  // const fromTime = watch(fromTimeFieldName);
  // const toTime = watch(toTimeFieldName);

  const handleRemoveNotification = () => {
    remove(index);
  };

  const updateTime = (selected: string | number) => {
    setValue(`${notificationFieldName}`, {
      atTime: selected === NotificationType.Fixed ? startTime : null,
      fromTime: selected === NotificationType.Random ? startTime : null,
      toTime: selected === NotificationType.Random ? endTime : null,
      triggerType: selected as NotificationType,
    });
  };

  useEffect(() => {
    trigger([atTimeFieldName, fromTimeFieldName, toTimeFieldName]);
  }, [atTime, fromTime, toTime, startTime, endTime]);

  return (
    <StyledNotificationWrapper data-testid={dataTestid}>
      <StyledLabelLarge sx={{ margin: theme.spacing(0, 0, 1.2, 1.1) }}>
        {t('notification')} {index + 1}
      </StyledLabelLarge>
      <StyledNotification>
        <Header onClickHandler={handleRemoveNotification} data-testid={dataTestid} />
        <StyledFlexTopStart>
          <StyledLeftCol>
            <ToggleButtonGroup
              toggleButtons={notificationTimeToggles}
              activeButton={notification.triggerType}
              customChange={updateTime}
              data-testid={`${dataTestid}-type`}
            />
          </StyledLeftCol>
          <StyledCol sx={{ marginLeft: theme.spacing(2.4) }}>
            {notification.triggerType === NotificationType.Fixed ? (
              <StyledColInner>
                <TimePicker
                  // providedValue={atTime}
                  name={atTimeFieldName}
                  label={t('at')}
                  data-testid={`${dataTestid}-time`}
                />
              </StyledColInner>
            ) : (
              <>
                <StyledColInner>
                  <TimePicker
                    // providedValue={fromTime}
                    name={fromTimeFieldName}
                    label={t('from')}
                    data-testid={`${dataTestid}-from`}
                  />
                </StyledColInner>
                <StyledColInner sx={{ marginLeft: theme.spacing(2.4) }}>
                  <TimePicker
                    // providedValue={toTime}
                    name={toTimeFieldName}
                    label={t('to')}
                    data-testid={`${dataTestid}-to`}
                  />
                </StyledColInner>
              </>
            )}
          </StyledCol>
        </StyledFlexTopStart>
      </StyledNotification>
    </StyledNotificationWrapper>
  );
};
