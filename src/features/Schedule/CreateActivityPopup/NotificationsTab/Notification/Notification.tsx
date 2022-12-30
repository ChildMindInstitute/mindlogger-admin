import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { ToggleButtonGroup, Svg, TimePicker } from 'components';
import theme from 'styles/theme';
import { StyledLabelLarge } from 'styles/styledComponents/Typography';

import { useState } from 'react';
import { NotificationType } from '../../CreateActivityPopup.types';
import {
  StyledClose,
  StyledLogo,
  StyledNotification,
  StyledTimePickerContainer,
} from './Notification.styles';
import { notificationTimeToggles } from './Notification.const';

//import { NotificationProps, NotificationTimeType } from './Notification.types';

export const Notification = ({ index, remove }: any) => {
  const { t } = useTranslation('app');
  const [activeType, setActivetype] = useState<string>(NotificationType.fixed);

  const handleRemoveNotification = () => {
    remove(index);
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
            toggleButtons={notificationTimeToggles}
            activeButton={activeType}
            setActiveButton={setActivetype}
          />
        </Box>
        <StyledTimePickerContainer>
          {activeType === NotificationType.fixed ? (
            <TimePicker name={`notifications.${index}.at`} label={t('at')} width={13} />
          ) : (
            <>
              <TimePicker name={`notifications.${index}.from`} label={t('from')} width={13} />
              <TimePicker name={`notifications.${index}.to`} label={t('to')} width={13} />
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
