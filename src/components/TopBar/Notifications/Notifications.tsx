import { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { Svg } from 'components/Svg';
import { account, folders } from 'redux/modules';
import { useTimeAgo } from 'hooks';
import { getAppletData } from 'utils/getAppletData';
import { variables } from 'styles/variables';
import { StyledLabelBoldLarge, StyledTitleSmall } from 'styles/styledComponents/Typography';
import { StyledFlexTopCenter } from 'styles/styledComponents/Flex';

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
  const accData = account.useData();
  const appletsFoldersData = folders.useFlattenFoldersApplets();
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
        const { firstName, lastName = '', nickName } = alerts.profiles[alert.profileId];
        const { name, image, encryption } = getAppletData(appletsFoldersData, alert.appletId);

        return {
          accountId: accData.account.accountId,
          alertId: alert.id,
          label: name || '',
          title: firstName || lastName ? `${firstName} ${lastName}` : nickName,
          message: alert.alertMessage,
          imageSrc: image || null,
          timeAgo: timeAgo.format(new Date(alert.created), 'round'),
          viewed: alert.viewed,
          encryption,
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
          {alertsQuantity === 0 && (
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
