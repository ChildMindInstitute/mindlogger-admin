import { useEffect, useState } from 'react';
import { Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import { FormProvider, useForm } from 'react-hook-form';

import { applet } from 'shared/state/Applet';
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
import { IntegrationTypes } from 'shared/consts';

import { StyledLink, StyledLorisIntegration, StyledStatusChip } from './LorisIntegration.styles';
import { ConfigurationPopup } from './ConfigurationPopup';
import { DisconnectionPopup } from './DisconnectionPopup';
import { UploadPopup } from './UploadPopup';
import { useUpdateLorisIntegrationStatus } from './LorisIntegration.hooks';
import { hasLorisIntegrationOnState } from './LorisIntegration.utils';

export const LorisIntegration = () => {
  const { t } = useTranslation('app');
  const navigate = useNavigate();

  const isServerConfigured = useIsServerConfigured();
  const { result: appletData } = applet.useAppletData() ?? {};

  const methods = useForm({
    defaultValues: {
      hostname: '',
      project: '',
    },
  });

  const [isConfigurationPopupVisible, setIsConfigurationPopupVisible] = useState(false);
  const [isDisconnectionPopupVisible, setIsDisconnectionPopupVisible] = useState(false);
  const [isUploadPopupVisible, setIsUploadPopupVisible] = useState(false);
  const [isIntegrationEnabled, setIsIntegrationEnabled] = useState(
    hasLorisIntegrationOnState(appletData?.integrations),
  );

  useUpdateLorisIntegrationStatus();

  const appletLorisIntegration = appletData?.integrations?.find(
    (i) => i.integrationType === IntegrationTypes.Loris,
  );

  const handleRedirect = () =>
    navigate(`/builder/${appletData?.id}/settings/${SettingParam.ReportConfiguration}`);

  const handleConnect = () => {
    setIsConfigurationPopupVisible(true);
  };

  useEffect(() => {
    if (
      appletLorisIntegration?.configuration.hostname &&
      appletLorisIntegration?.configuration.project
    ) {
      setIsIntegrationEnabled(true);
    } else {
      setIsIntegrationEnabled(false);
    }
  }, [appletLorisIntegration]);

  return (
    <FormProvider {...methods}>
      <StyledLorisIntegration data-testid="loris-integration">
        <Box>
          <Svg width={94} height={94} id="loris-integration" />
        </Box>
        <Box>
          <StyledTitleBoldLargish
            sx={{ color: variables.palette.on_surface, mb: theme.spacing(1.2) }}
          >
            LORIS
          </StyledTitleBoldLargish>
          {isIntegrationEnabled && isServerConfigured && (
            <StyledStatusChip
              sx={{
                backgroundColor: isServerConfigured
                  ? variables.palette.green_light
                  : variables.palette.red_light,
              }}
            >
              <Svg width={18} height={18} id="server-connect" />
              <StyledLabelLarge
                sx={{ ml: theme.spacing(0.8), color: variables.palette.on_surface }}
              >
                {t('loris.reportServerStatusConnected')}
              </StyledLabelLarge>
            </StyledStatusChip>
          )}
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
    </FormProvider>
  );
};
