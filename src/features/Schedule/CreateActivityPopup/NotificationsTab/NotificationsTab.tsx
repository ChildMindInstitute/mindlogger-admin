import { Button } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { Svg } from 'components/Svg';
import theme from 'styles/theme';
import { StyledFlexTopCenter } from 'styles/styledComponents/Flex';
import { SelectController } from 'components/FormComponents';
import { CheckboxController } from 'components/FormComponents';
import { StyledBodyMedium, StyledTitleMedium } from 'styles/styledComponents/Typography';

// import { options } from './Notification.utils';
import { AvailabilityProps } from './NotificationsTab.types';
import { StyledRow, StyledAddBtn } from './NotificationsTab.styles';
import { Notification } from './Notification';

export const NotificationsTab = ({ control }: AvailabilityProps) => {
  const { t } = useTranslation('app');

  return (
    <>
      <StyledBodyMedium>{t('setTheLimit')}:</StyledBodyMedium>
      <StyledRow>
        <StyledFlexTopCenter>
          <Svg id="alert" width="16" height="20" />
          <StyledTitleMedium sx={{ marginLeft: theme.spacing(1.6) }}>
            {t('sendNotifications')}
          </StyledTitleMedium>
        </StyledFlexTopCenter>
        <StyledAddBtn variant="text" startIcon={<Svg width="18" height="18" id="add" />}>
          {t('addNotification')}
        </StyledAddBtn>
        <Notification control={control} />
      </StyledRow>
      <StyledRow>
        <StyledFlexTopCenter>
          <Svg id="clock" width="20" height="20" />
          <StyledTitleMedium sx={{ marginLeft: theme.spacing(1.3) }}>
            {t('sendReminder')}
          </StyledTitleMedium>
        </StyledFlexTopCenter>
        <StyledAddBtn variant="text" startIcon={<Svg width="18" height="18" id="add" />}>
          {t('addReminder')}
        </StyledAddBtn>
      </StyledRow>
    </>
  );
};
