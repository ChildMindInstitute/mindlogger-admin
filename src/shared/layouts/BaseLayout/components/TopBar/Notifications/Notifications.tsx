import { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { Svg } from 'shared/components';
import { useTimeAgo } from 'shared/hooks';
import { getAppletData, getDateInUserTimezone } from 'shared/utils';
import {
  variables,
  StyledLabelBoldLarge,
  StyledTitleSmall,
  StyledFlexTopCenter,
} from 'shared/styles';
import { alerts } from 'shared/state';

import { Notification, NotificationProps } from './Notification';
import {
  StyledHeader,
  StyledHeaderLeft,
  StyledIconWrapper,
  StyledCollapseBtn,
  StyledList,
  StyledCentered,
} from './Notifications.styles';
import { NotificationsProps } from './Notifications.types';

export const Notifications = ({ alertsQuantity }: NotificationsProps): JSX.Element => {
  const { t } = useTranslation('app');
  const { result: alertList } = alerts.useAlertsData() ?? {};
  const [showList, setShowList] = useState(true);
  const [notifications, setNotifications] = useState<
    Omit<NotificationProps, 'currentId' | 'setCurrentId'>[] | null
  >(null);
  const [currentId, setCurrentId] = useState('');

  const timeAgo = useTimeAgo();

  useEffect(() => {
    if (!alertList?.length) return;

    const alerts = alertList.map((alert) => {
      const { name, image, encryption } = getAppletData([], alert.appletId);

      return {
        accountId: alert.secretId,
        alertId: alert.id,
        label: alert.appletName,
        title: name ?? '',
        message: alert.message,
        imageSrc: image || null,
        timeAgo: timeAgo.format(getDateInUserTimezone(alert.createdAt), 'round'),
        viewed: alert.isWatched,
        encryption: encryption || undefined,
        appletId: alert.appletId,
        alert,
      };
    });
    setNotifications(alerts);
  }, [alertList]);

  return (
    <Box>
      <StyledHeader>
        <StyledHeaderLeft>
          <StyledIconWrapper>
            <Svg id="alert" width="16" height="20" />
          </StyledIconWrapper>
          <StyledLabelBoldLarge>{t('alerts')}</StyledLabelBoldLarge>
        </StyledHeaderLeft>
        <StyledFlexTopCenter>
          {alertsQuantity > 0 && (
            <StyledLabelBoldLarge color={variables.palette.semantic.error}>
              {`${alertsQuantity} ${t('unread')}`}
            </StyledLabelBoldLarge>
          )}
          <StyledCollapseBtn onClick={() => setShowList((prevState) => !prevState)}>
            <Svg id={showList ? 'navigate-up' : 'navigate-down'} />
          </StyledCollapseBtn>
        </StyledFlexTopCenter>
      </StyledHeader>
      {showList && (
        <StyledList>
          {!notifications?.length && (
            <StyledCentered>
              <StyledTitleSmall>{t('noAlerts')}</StyledTitleSmall>
            </StyledCentered>
          )}
          {notifications?.map((item) => (
            <Notification
              key={item.alertId}
              currentId={currentId}
              setCurrentId={setCurrentId}
              {...item}
            />
          ))}
        </StyledList>
      )}
    </Box>
  );
};
