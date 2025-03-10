import { Box, Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { MixpanelEventType } from 'shared/utils';
import { useAppDispatch } from 'redux/store';
import { Svg } from 'shared/components';
import { IntegrationTypes } from 'shared/consts';
import { applet, SingleApplet } from 'shared/state/Applet';
import {
  StyledFlexAllCenter,
  StyledLabelLarge,
  StyledTitleBoldLargish,
  StyledTitleMedium,
  theme,
  variables,
} from 'shared/styles';
import { getUserDetailsApi } from 'api';

import { ConfigurationPopup } from './ConfigurationPopup/ConfigurationPopup';
import { DisconnectionPopup } from './DisconnectionPopup/DisconnectionPopup';
import { StyledLinkConfiguration } from './ProlificIntegration.styles';
import { prolificIntegrationExists, trackProlificEvent } from './ProlificIntegration.utils';
import { StyledIntegration, StyledStatusChip } from '../../IntegrationsListSetting.styles';

type ProlificIntegrationState = {
  apiTokenExists: boolean;
  isConfigurationPopupVisible: boolean;
  isDisconnectPopupVisible: boolean;
  userId: string | null;
};

export const ProlificIntegration = () => {
  const { result: appletData } = applet.useAppletData() ?? {};
  if (!appletData) return null;

  const id = appletData.id;
  if (!id) return null;

  return <ProlifcIntegrationApplet appletData={{ ...appletData, id }} />;
};

type ProlificIntegrationAppletProps = {
  appletData: SingleApplet & { id: string };
};

const ProlifcIntegrationApplet = ({ appletData }: ProlificIntegrationAppletProps) => {
  const [
    { apiTokenExists, isConfigurationPopupVisible, isDisconnectPopupVisible, userId },
    setState,
  ] = useState<ProlificIntegrationState>({
    apiTokenExists: false,
    isConfigurationPopupVisible: false,
    isDisconnectPopupVisible: false,
    userId: null,
  });

  const handleConnect = () => {
    trackProlificEvent(MixpanelEventType.ProlificConnectClick, userId);

    setState((prevState) => ({
      ...prevState,
      isConfigurationPopupVisible: true,
    }));
  };

  const handleDisconnect = () => {
    setState((prevState) => ({
      ...prevState,
      isDisconnectPopupVisible: true,
    }));
  };

  const dispatch = useAppDispatch();

  const { updateAppletData: updateApplet } = applet.actions;

  const updateAppletData = (newAppletData: SingleApplet) => {
    dispatch(updateApplet(newAppletData));

    trackProlificEvent(MixpanelEventType.ProlificConnectSuccessful, userId);
  };

  useEffect(() => {
    const checkProlificApiToken = async () => {
      const hasLocalProlificIntegration =
        appletData.integrations?.some((i) => i.integrationType === IntegrationTypes.Prolific) ??
        false;

      const hasRemoteProlificIntegration = await prolificIntegrationExists(appletData.id);

      setState((prevState) => ({
        ...prevState,
        apiTokenExists: hasLocalProlificIntegration || hasRemoteProlificIntegration,
      }));
    };

    const getCurrentUser = async () => {
      const user = await getUserDetailsApi();

      if (user.data?.result) {
        setState((prevState) => ({ ...prevState, userId: user.data.result.id }));
      }
    };

    checkProlificApiToken();
    getCurrentUser();
  }, [appletData.id, appletData.integrations]);

  const { t } = useTranslation('app');

  return (
    <StyledIntegration data-testid="prolific-integration">
      <Box>
        <Svg width={130} height={100} id="prolific-integration" />
      </Box>
      <Box>
        <StyledTitleBoldLargish>Prolific</StyledTitleBoldLargish>
        {apiTokenExists && (
          <StyledStatusChip
            sx={{
              backgroundColor: variables.palette.green_light,
            }}
          >
            <Svg width={18} height={18} id="server-connect" />
            <StyledLabelLarge
              sx={{ ml: theme.spacing(0.8), color: variables.palette.on_surface }}
              data-testid="prolific-connected"
            >
              {t('prolific.prolificConnectionStatus')}
            </StyledLabelLarge>
          </StyledStatusChip>
        )}
        <StyledTitleMedium
          sx={{
            color: variables.palette.on_surface,
            mb: theme.spacing(1.2),
          }}
          data-testid="prolific-description"
        >
          {t('prolific.description')}
        </StyledTitleMedium>
        {apiTokenExists && (
          <StyledLinkConfiguration onClick={handleDisconnect} data-testid="prolific-disconnect">
            <Svg width={21} height={21} id="disconnection" />
            {t('prolific.disconnect')}
          </StyledLinkConfiguration>
        )}
      </Box>
      <StyledFlexAllCenter>
        {!apiTokenExists && (
          <Button
            variant="contained"
            sx={{ minWidth: '13rem' }}
            onClick={handleConnect}
            data-testid="prolific-connect"
          >
            {t('prolific.connect')}
          </Button>
        )}
      </StyledFlexAllCenter>
      {isConfigurationPopupVisible && (
        <ConfigurationPopup
          open={isConfigurationPopupVisible}
          onClose={() =>
            setState((prevState) => ({ ...prevState, isConfigurationPopupVisible: false }))
          }
          applet={appletData}
          updateAppletData={updateAppletData}
          data-testid="prolific-configuration-popup"
        />
      )}
      {isDisconnectPopupVisible && (
        <DisconnectionPopup
          applet={appletData}
          updateAppletData={updateAppletData}
          open={isDisconnectPopupVisible}
          onClose={() =>
            setState((prevState) => ({ ...prevState, isDisconnectPopupVisible: false }))
          }
          data-testid="prolific-disconnection-popup"
        />
      )}
    </StyledIntegration>
  );
};
