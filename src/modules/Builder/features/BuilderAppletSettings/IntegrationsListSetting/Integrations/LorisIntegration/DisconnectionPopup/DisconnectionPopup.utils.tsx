import { Box } from '@mui/material';

import i18n from 'i18n';
import { StyledTitleMedium, theme, variables } from 'shared/styles';

import { DisconnectionSteps, GetScreensProps } from './DisconnectionPopup.types';
import { ConnectionInfo } from '../ConnectionInfo';

const { t } = i18n;

export const getScreens = ({ onClose, setStep }: GetScreensProps) => [
  {
    leftButtonText: t('cancel'),
    rightButtonText: t('loris.disconnect'),
    content: (
      <>
        <StyledTitleMedium sx={{ color: variables.palette.on_surface, mb: theme.spacing(1.2) }}>
          {t('loris.connection')}
        </StyledTitleMedium>
        <Box>
          <ConnectionInfo />
        </Box>
      </>
    ),
    leftButtonClick: onClose,
    rightButtonClick: () => setStep(DisconnectionSteps.Confirmation),
    height: '58rem',
  },
  {
    leftButtonText: t('back'),
    rightButtonText: t('confirm'),
    content: (
      <StyledTitleMedium sx={{ color: variables.palette.on_surface, mb: theme.spacing(1.8) }}>
        {t('loris.disconnectConfirmation')}
      </StyledTitleMedium>
    ),
    leftButtonClick: () => setStep(DisconnectionSteps.CurrentConnectionInfo),
    rightButtonClick: () => {},
  },
];
