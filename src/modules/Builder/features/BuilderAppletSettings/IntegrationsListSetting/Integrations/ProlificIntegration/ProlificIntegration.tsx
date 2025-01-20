import { Box, Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

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

import { ConfigurationPopup } from './ConfigurationPopup/ConfigurationPopup';
import { DisconnectionPopup } from './DisconnectionPopup/DisconnectionPopup';
import {
  StyledLinkConfiguration,
  StyledProlificIntegration,
  StyledStatusChip,
} from './ProlificIntegration.styles';
import { prolificIntegrationExists } from './ProlificIntegration.utils';

type ProlificIntegrationState = {
  apiTokenExists: boolean;
  isConfigurationPopupVisible: boolean;
  isDisconnectPopupVisible: boolean;
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
  const [{ apiTokenExists, isConfigurationPopupVisible, isDisconnectPopupVisible }, setState] =
    useState<ProlificIntegrationState>({
      apiTokenExists: false,
      isConfigurationPopupVisible: false,
      isDisconnectPopupVisible: false,
    });

  const handleConnect = () => {
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
  };

  useEffect(() => {
    const checkProlificApiToken = async () => {
      const apiTokenExists =
        appletData.integrations?.some((i) => i.integrationType === IntegrationTypes.Prolific) ??
        (await prolificIntegrationExists(appletData.id));

      setState((prevState) => ({
        ...prevState,
        apiTokenExists,
      }));
    };

    checkProlificApiToken();
  }, [appletData.id, appletData.integrations]);

  const { t } = useTranslation('app');

  return (
    <StyledProlificIntegration data-testid="prolific-integration">
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
    </StyledProlificIntegration>
  );
};
