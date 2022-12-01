import { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { Svg } from 'components/Svg';
import { account } from 'redux/modules';
import { useTimeAgo } from 'hooks';
import { getAppletData } from 'utils/getAppletData';
import { variables } from 'styles/variables';
import { StyledLabelLarge } from 'styles/styledComponents/Typography';
import { StyledFlexTopCenter } from 'styles/styledComponents/Flex';

import { Notification, NotificationProps } from './Notification';
import {
  StyledHeader,
  StyledHeaderLeft,
  StyledIconWrapper,
  StyledCollapseBtn,
  StyledList,
} from './Notifications.styles';
import { NotificationsProps } from './Notifications.types';

export const Notifications = ({ alertsQuantity }: NotificationsProps): JSX.Element => {
  const { t } = useTranslation('app');
  const accData = account.useData();
  const appletsFoldersData = account.useFoldersApplets();
  const [showList, setShowList] = useState(true);
  const [notifications, setNotifications] = useState<
    Omit<NotificationProps, 'currentId' | 'setCurrentId'>[] | null
  >(null);
  const [currentId, setCurrentId] = useState('');

  const timeAgo = useTimeAgo();

  useEffect(() => {
    if (accData) {
      const accAlerts = accData.account.alerts.list.map((alert) => {
        const { alerts } = accData.account;
        const { firstName, lastName = '' } = alerts.profiles[alert.profileId];
        const { name, image } = getAppletData(appletsFoldersData, alert.appletId);

        return {
          accountId: accData.account.accountId,
          alertId: alert.id,
          label: name || '',
          title: `${firstName} ${lastName}`,
          message: alert.alertMessage,
          imageSrc: image || null,
          timeAgo: timeAgo.format(new Date(alert.created), 'round'),
          viewed: alert.viewed,
        };
      });

      setNotifications(accAlerts);
    }
  }, [accData, appletsFoldersData]);

  return (
    <Box>
      <StyledHeader>
        <StyledHeaderLeft>
          <StyledIconWrapper>
            <Svg id="alert" width="16" height="20" />
          </StyledIconWrapper>
          <StyledLabelLarge color={variables.palette.on_surface_variant} fontWeight="semiBold">
            {t('alerts')}
          </StyledLabelLarge>
        </StyledHeaderLeft>
        <StyledFlexTopCenter>
          <StyledLabelLarge color={variables.palette.on_surface_variant} fontWeight="semiBold">
            {`${alertsQuantity} `}
            {t('unread')}
          </StyledLabelLarge>
          <StyledCollapseBtn onClick={() => setShowList((prevState) => !prevState)}>
            <Svg id={showList ? 'navigate-up' : 'navigate-down'} width="12" height="8" />
          </StyledCollapseBtn>
        </StyledFlexTopCenter>
      </StyledHeader>
      {showList && notifications && (
        <StyledList>
          {notifications.map((item) => (
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
