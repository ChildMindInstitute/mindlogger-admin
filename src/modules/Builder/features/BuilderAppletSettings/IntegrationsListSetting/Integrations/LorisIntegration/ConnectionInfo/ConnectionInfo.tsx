import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';

import { StyledBodyLarge, StyledLabelBoldLarge, theme } from 'shared/styles';

import { StyledConnectionInfo } from './ConnectionInfo.styles';
import { useLorisConnectionInfo } from '../LorisIntegration.hooks';

export const ConnectionInfo = () => {
  const { t } = useTranslation();

  const { hostname, project, username } = useLorisConnectionInfo();

  return (
    <StyledConnectionInfo data-testid="connection-info">
      <Box>
        <StyledLabelBoldLarge> {t('loris.serverHostname')}</StyledLabelBoldLarge>
        <StyledBodyLarge>{hostname}</StyledBodyLarge>
      </Box>
      <Box sx={{ mt: theme.spacing(1.2) }}>
        <StyledLabelBoldLarge>{t('loris.username')}</StyledLabelBoldLarge>
        <StyledBodyLarge>{username}</StyledBodyLarge>
      </Box>
      <Box sx={{ mt: theme.spacing(1.2) }}>
        <StyledLabelBoldLarge>{t('loris.project')}</StyledLabelBoldLarge>
        <StyledBodyLarge>{project}</StyledBodyLarge>
      </Box>
    </StyledConnectionInfo>
  );
};
