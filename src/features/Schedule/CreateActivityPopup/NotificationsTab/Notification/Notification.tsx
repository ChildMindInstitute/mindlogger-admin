import { useState } from 'react';
import { Box, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { Svg } from 'components/Svg';
import { ToggleButtonGroup } from 'components/ToggleButtonGroup';
import { TimePicker } from 'components/TimePicker';
import theme from 'styles/theme';
import { StyledFlexTopCenter } from 'styles/styledComponents/Flex';
import { StyledLabelLarge } from 'styles/styledComponents/Typography';

// import { options } from './Notification.utils';
import { AvailabilityProps } from './Notification.types';
import { StyledNotification } from './Notification.styles';
import { getNotificationTimeToggles } from './Notification.utils';

export const Notification = ({ control }: AvailabilityProps) => {
  const { t } = useTranslation('app');
  const notificationsTimeToggles = getNotificationTimeToggles(t);
  const [activeToggleBtn, setActiveToggleBtn] = useState(notificationsTimeToggles[0].value);
  const [firstTime, setFirstTime] = useState<Date | null | undefined>(new Date());

  console.log('first time', firstTime);

  return (
    <StyledNotification>
      <Box>
        <StyledFlexTopCenter>
          <Svg id="mindlogger-logo" />
          <StyledLabelLarge sx={{ marginLeft: theme.spacing(1) }}>MindLogger</StyledLabelLarge>
        </StyledFlexTopCenter>
        <ToggleButtonGroup
          toggleButtons={notificationsTimeToggles}
          activeButton={activeToggleBtn}
          setActiveButton={setActiveToggleBtn}
        />
      </Box>
      <Box>
        <TimePicker value={firstTime} setValue={setFirstTime} label={t('at')} />
      </Box>
    </StyledNotification>
  );
};
