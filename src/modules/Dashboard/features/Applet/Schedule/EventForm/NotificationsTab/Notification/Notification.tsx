import { useEffect } from 'react';

import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { NotificationType } from 'modules/Dashboard/api';
import { getNextDayComparison } from 'modules/Dashboard/state/CalendarEvents/CalendarEvents.utils';
import { ToggleButtonGroup, TimePicker } from 'shared/components';
import { StyledFlexTopStart, StyledLabelLarge, StyledTitleSmall, theme } from 'shared/styles';

import { DEFAULT_START_TIME } from '../../EventForm.const';
import { Header } from '../Header';
import { StyledColInner, StyledNotificationWrapper } from '../NotificationsTab.styles';
import { notificationTimeToggles } from './Notification.const';
import { StyledNotification, StyledCol, StyledLeftCol } from './Notification.styles';
import { NotificationProps } from './Notification.types';

export const Notification = ({ index, remove, 'data-testid': dataTestid }: NotificationProps) => {
  const { t } = useTranslation('app');
  const { setValue, control, trigger } = useFormContext();

  const notificationFieldName = `notifications.${index}`;
  const atTimeFieldName = `${notificationFieldName}.atTime`;
  const fromTimeFieldName = `${notificationFieldName}.fromTime`;
  const toTimeFieldName = `${notificationFieldName}.toTime`;

  const [notification, startTime, endTime, atTime, fromTime, toTime] = useWatch({
    control,
    name: [notificationFieldName, 'startTime', 'endTime', atTimeFieldName, fromTimeFieldName, toTimeFieldName],
  });
  const isCrossDayEvent = getNextDayComparison(startTime, endTime);
  const getNextDayLabel = (time: string) =>
    isCrossDayEvent &&
    new Date(`2000-01-01T${time}:00`) >= new Date(`2000-01-01T${DEFAULT_START_TIME}:00`) &&
    new Date(`2000-01-01T${time}:00`) <= new Date(`2000-01-01T${endTime}:00`) && (
      <StyledTitleSmall
        sx={{
          mx: theme.spacing(1.6),
        }}>
        {t('nextDay')}
      </StyledTitleSmall>
    );

  const handleRemoveNotification = () => {
    remove(index);
  };

  const updateTime = (selected: string | number) => {
    setValue(
      `${notificationFieldName}`,
      {
        atTime: selected === NotificationType.Fixed ? startTime : null,
        fromTime: selected === NotificationType.Random ? startTime : null,
        toTime: selected === NotificationType.Random ? endTime : null,
        triggerType: selected as NotificationType,
      },
      { shouldDirty: true },
    );
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
                  name={atTimeFieldName}
                  key={atTimeFieldName}
                  label={t('at')}
                  data-testid={`${dataTestid}-time`}
                />
                {getNextDayLabel(atTime)}
              </StyledColInner>
            ) : (
              <>
                <StyledColInner>
                  <TimePicker
                    name={fromTimeFieldName}
                    key={fromTimeFieldName}
                    label={t('from')}
                    data-testid={`${dataTestid}-from`}
                  />
                  {getNextDayLabel(fromTime)}
                </StyledColInner>
                <StyledColInner sx={{ marginLeft: theme.spacing(2.4) }}>
                  <TimePicker
                    name={toTimeFieldName}
                    key={toTimeFieldName}
                    label={t('to')}
                    data-testid={`${dataTestid}-to`}
                  />
                  {getNextDayLabel(toTime)}
                </StyledColInner>
              </>
            )}
          </StyledCol>
        </StyledFlexTopStart>
      </StyledNotification>
    </StyledNotificationWrapper>
  );
};
