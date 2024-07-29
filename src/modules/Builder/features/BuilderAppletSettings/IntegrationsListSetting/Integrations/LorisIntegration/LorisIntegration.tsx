import { useState } from 'react';
import { Box, Button } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';

import { applet } from 'redux/modules';
import { Svg } from 'shared/components';
import { SettingParam } from 'shared/utils';
import { useIsServerConfigured } from 'shared/hooks/useIsServerConfigured';
import {
  StyledFlexAllCenter,
  StyledLabelLarge,
  StyledTitleBoldLargish,
  StyledTitleMedium,
  theme,
  variables,
} from 'shared/styles';
import { Integrations } from 'shared/consts';

import { StyledLink, StyledLorisIntegration, StyledStatusChip } from './LorisIntegration.styles';
import { ConfigurationPopup } from './ConfigurationPopup';
import { DisconnectionPopup } from './DisconnectionPopup';
import { UploadPopup } from './UploadPopup';

export const LorisIntegration = () => {
  const { t } = useTranslation('app');
  const navigate = useNavigate();
  const { appletId } = useParams();

  const isServerConfigured = useIsServerConfigured();
  const { result: appletData } = applet.useAppletData() ?? {};

  const [isConfigurationPopupVisible, setIsConfigurationPopupVisible] = useState(false);
  const [isDisconnectionPopupVisible, setIsDisconnectionPopupVisible] = useState(false);
  const [isUploadPopupVisible, setIsUploadPopupVisible] = useState(false);

  const isIntegrationEnabled = appletData?.integrations?.some(
    (integration) => integration?.toLowerCase() === Integrations.Loris.toLowerCase(),
  );

  const handleRedirect = () =>
    navigate(`/builder/${appletId}/settings/${SettingParam.ReportConfiguration}`);

  const handleConnect = () => {
    setIsConfigurationPopupVisible(true);
  };

  return (
    <>
      <StyledLorisIntegration>
        <Box>
          <Svg width={94} height={94} id="loris-integration" />
        </Box>
        <Box>
          <StyledTitleBoldLargish
            sx={{ color: variables.palette.on_surface, mb: theme.spacing(1.2) }}
          >
            LORIS
          </StyledTitleBoldLargish>
          <StyledStatusChip
            sx={{
              backgroundColor: isServerConfigured
                ? variables.palette.green_light
                : variables.palette.red_light,
            }}
          >
            <Svg width={18} height={18} id="server-connect" />
            <StyledLabelLarge sx={{ ml: theme.spacing(0.8), color: variables.palette.on_surface }}>
              {t(
                isServerConfigured
                  ? 'loris.reportServerStatusConnected'
                  : 'loris.reportServerStatusNotConnected',
              )}
            </StyledLabelLarge>
          </StyledStatusChip>
          <StyledTitleMedium
            sx={{
              color: variables.palette.on_surface,
              mb: theme.spacing(1.2),
            }}
          >
            {t('loris.description')}
          </StyledTitleMedium>
          {!isServerConfigured && (
            <StyledTitleMedium
              data-testid="loris-integration-description"
              sx={{
                color: variables.palette.on_surface_variant,
              }}
            >
              <Trans i18nKey="loris.configureReportServerHint">
                For Security reasons, you must configure the Server URL (IP Address) and Public
                Encryption Key to generate and email reports.
                <StyledLink onClick={handleRedirect}>Report Configuration</StyledLink>.
              </Trans>
            </StyledTitleMedium>
          )}
          {isIntegrationEnabled && (
            <StyledTitleMedium
              sx={{ color: variables.palette.primary, cursor: 'pointer' }}
              onClick={() => setIsDisconnectionPopupVisible(true)}
              data-testid="loris-integration-disconnect-button"
            >
              {t('loris.disconnect')}
            </StyledTitleMedium>
          )}
        </Box>
        <StyledFlexAllCenter>
          {isIntegrationEnabled ? (
            <Button
              variant="outlined"
              sx={{ minWidth: '13rem' }}
              onClick={() => setIsUploadPopupVisible(true)}
              data-testid="loris-integration-upload-button"
            >
              {t('upload')}
            </Button>
          ) : (
            <Button
              variant="contained"
              disabled={!isServerConfigured}
              sx={{ minWidth: '13rem' }}
              onClick={handleConnect}
              data-testid="loris-integration-connect-button"
            >
              {t('loris.connect')}
            </Button>
          )}
        </StyledFlexAllCenter>
      </StyledLorisIntegration>
      {isConfigurationPopupVisible && (
        <ConfigurationPopup
          open={isConfigurationPopupVisible}
          onClose={() => setIsConfigurationPopupVisible(false)}
        />
      )}
      {isDisconnectionPopupVisible && (
        <DisconnectionPopup
          open={isDisconnectionPopupVisible}
          onClose={() => setIsDisconnectionPopupVisible(false)}
        />
      )}
      {isUploadPopupVisible && (
        <UploadPopup open={isUploadPopupVisible} onClose={() => setIsUploadPopupVisible(false)} />
      )}
    </>
  );
};
