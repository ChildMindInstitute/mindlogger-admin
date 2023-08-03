import { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { Spinner, Svg } from 'shared/components';
import { useTimeAgo } from 'shared/hooks';
import { getDateInUserTimezone } from 'shared/utils';
import {
  variables,
  StyledLabelBoldLarge,
  StyledTitleSmall,
  StyledFlexTopCenter,
  StyledObserverTarget,
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
  StyledBox,
} from './Notifications.styles';
import { NotificationsProps } from './Notifications.types';
import { ALERT_LIST_CLASS, ALERT_END_ITEM_CLASS } from './Notifications.const';
import { useInfinityData } from './Notifications.hooks';

export const Notifications = ({ alertsQuantity }: NotificationsProps): JSX.Element => {
  const { t } = useTranslation('app');
  const { result: alertList = [] } = alerts.useAlertsData() ?? {};
  const alertListStatus = alerts.useAlertsStatus() ?? {};
  const [showList, setShowList] = useState(true);
  const [notifications, setNotifications] = useState<
    Omit<NotificationProps, 'currentId' | 'setCurrentId'>[] | null
  >(null);
  const [currentId, setCurrentId] = useState('');

  const timeAgo = useTimeAgo();

  useEffect(() => {
    if (!alertList.length) return;

    const alerts = alertList.map((alert) => ({
      ...alert,
      timeAgo: timeAgo.format(getDateInUserTimezone(alert.createdAt), 'round'),
      alert,
    }));
    setNotifications(alerts);
  }, [alertList]);

  useInfinityData();

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
        <StyledList className={ALERT_LIST_CLASS}>
          {!notifications?.length && (
            <StyledCentered>
              <StyledTitleSmall>{t('noAlerts')}</StyledTitleSmall>
            </StyledCentered>
          )}
          {notifications?.map((item) => (
            <Notification
              key={item.id}
              currentId={currentId}
              setCurrentId={setCurrentId}
              {...item}
            />
          ))}
          {alertListStatus === 'loading' && (
            <StyledBox>
              <Spinner />
            </StyledBox>
          )}
          <StyledObserverTarget className={ALERT_END_ITEM_CLASS} />
        </StyledList>
      )}
    </Box>
  );
};
