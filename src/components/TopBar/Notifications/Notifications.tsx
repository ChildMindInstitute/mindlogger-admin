import { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { Svg } from 'components/Svg';
import { variables } from 'styles/variables';
import { StyledLabelLarge } from 'styles/styledComponents/Typography';
import { account } from 'redux/modules';
import { useTimeAgo } from 'utils/hooks';

import { Notification, NotificationProps } from './Notification';
import {
  StyledHeader,
  StyledHeaderLeft,
  StyledHeaderRight,
  StyledIconWrapper,
  StyledCollapseBtn,
  StyledList,
} from './Notifications.styles';
import { NotificationsProps } from './Notifications.types';

export const Notifications = ({ alertsQuantity }: NotificationsProps): JSX.Element => {
  const { t } = useTranslation('app');
  const accData = account.useData();
  const [showList, setShowList] = useState(true);
  const [notifications, setNotifications] = useState<NotificationProps[] | null>(null);

  const timeAgo = useTimeAgo();

  useEffect(() => {
    if (accData) {
      const accAlerts = accData.account.alerts.list.map((alert) => {
        const { applets, alerts } = accData.account;
        const applet = applets.find((applet) => applet.id === alert.appletId);
        const { firstName, lastName = '' } = alerts.profiles[alert.profileId];

        return {
          accountId: accData.account.accountId,
          alertId: alert.id,
          label: applet?.displayName || '',
          title: `${firstName} ${lastName}`,
          message: alert.alertMessage,
          imageSrc: applet?.image || null,
          timeAgo: timeAgo.format(new Date(alert.created), 'round'),
          viewed: alert.viewed,
        };
      });

      setNotifications(accAlerts);
    }
  }, [accData]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Box>
      <StyledHeader>
        <StyledHeaderLeft>
          <StyledIconWrapper>
            <Svg id="notifications" width="16" height="20" />
          </StyledIconWrapper>
          <StyledLabelLarge color={variables.palette.on_surface_variant} fontWeight="semiBold">
            {t('alerts')}
          </StyledLabelLarge>
        </StyledHeaderLeft>
        <StyledHeaderRight>
          <StyledLabelLarge color={variables.palette.semantic.error} fontWeight="semiBold">
            {`${alertsQuantity} `}
            {t('unread')}
          </StyledLabelLarge>
          <StyledCollapseBtn onClick={() => setShowList((prevState) => !prevState)}>
            {showList ? (
              <Svg id="navigate-up" width="12" height="8" />
            ) : (
              <Svg id="navigate-down" width="12" height="8" />
            )}
          </StyledCollapseBtn>
        </StyledHeaderRight>
      </StyledHeader>
      {showList && notifications && (
        <StyledList>
          {notifications.map((item) => {
            const { accountId, alertId, label, title, message, timeAgo, imageSrc, viewed } = item;

            return (
              <Notification
                key={alertId}
                accountId={accountId}
                alertId={alertId}
                label={label}
                title={title}
                message={message}
                timeAgo={timeAgo}
                imageSrc={imageSrc}
                viewed={viewed}
              />
            );
          })}
        </StyledList>
      )}
    </Box>
  );
};
