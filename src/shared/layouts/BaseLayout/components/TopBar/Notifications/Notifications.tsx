import { useEffect, useState } from 'react';

import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { Spinner, Svg } from 'shared/components';
import { useTimeAgo } from 'shared/hooks';
import { useInfinityData } from 'shared/hooks/useInfinityData';
import { alerts } from 'shared/state';
import {
  variables,
  StyledLabelBoldLarge,
  StyledTitleSmall,
  StyledFlexTopCenter,
  StyledObserverTarget,
} from 'shared/styles';
import { getDateInUserTimezone } from 'shared/utils/dateTimezone';

import { Notification, NotificationProps } from './Notification';
import { ALERT_LIST_CLASS, ALERT_END_ITEM_CLASS } from './Notifications.const';
import {
  StyledHeader,
  StyledHeaderLeft,
  StyledIconWrapper,
  StyledCollapseBtn,
  StyledList,
  StyledCentered,
  StyledBox,
} from './Notifications.styles';

export const Notifications = () => {
  const { t } = useTranslation('app');
  const { result: alertList = [], notWatched = 0, count = 0 } = alerts.useAlertsData() ?? {};
  const alertListStatus = alerts.useAlertsStatus() ?? {};
  const [showList, setShowList] = useState(true);
  const [notifications, setNotifications] = useState<Omit<NotificationProps, 'currentId' | 'setCurrentId'>[] | null>(
    null,
  );
  const [currentId, setCurrentId] = useState('');
  const isLoading = alertListStatus === 'loading';

  const timeAgo = useTimeAgo();

  useEffect(() => {
    if (!alertList.length) return;

    const alerts = alertList.map(alert => ({
      ...alert,
      timeAgo: timeAgo.format(getDateInUserTimezone(alert.createdAt), 'round'),
      alert,
    }));
    setNotifications(alerts);
  }, [alertList]);

  useInfinityData({
    rootSelector: `.${ALERT_LIST_CLASS}`,
    targetSelector: `.${ALERT_END_ITEM_CLASS}`,
    totalSize: count,
    listSize: alertList.length,
    isLoading,
    getListThunk: alerts.thunk.getAlerts,
  });

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
          {notWatched > 0 && (
            <StyledLabelBoldLarge color={variables.palette.semantic.error}>
              {`${notWatched} ${t('unread')}`}
            </StyledLabelBoldLarge>
          )}
          <StyledCollapseBtn aria-label="collapse-expand" onClick={() => setShowList(prevState => !prevState)}>
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
          {notifications?.map(item => (
            <Notification key={item.id} currentId={currentId} setCurrentId={setCurrentId} {...item} />
          ))}
          {isLoading && (
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
