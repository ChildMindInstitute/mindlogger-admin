import { Box, Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Svg } from 'shared/components';
import {
  StyledFlexAllCenter,
  StyledLabelLarge,
  StyledTitleBoldLargish,
  StyledTitleMedium,
  theme,
  variables,
} from 'shared/styles';

import { ConfigurationPopup } from './ConfigurationPopup/ConfigurationPopup';
import {
  StyledLinkConfiguration,
  StyledProlificIntegration,
  StyledStatusChip,
} from './ProlificIntegration.styles';
import { getProlificApiToken } from './ProlificIntegration.utils';

export const ProlificIntegration = () => {
  const [apiTokenExists, setApiTokenExists] = useState(false);

  const [isConfigurationPopupVisible, setIsConfigurationPopupVisible] = useState(false);

  const handleConnect = () => {
    setIsConfigurationPopupVisible(true);
  };

  useEffect(() => {
    const checkProlificApiToken = async () => {
      const apiToken = await getProlificApiToken();
      setApiTokenExists(apiToken !== null && apiToken !== '');
    };

    checkProlificApiToken();
  }, [apiTokenExists]);

  const { t } = useTranslation('app');

  return (
    <StyledProlificIntegration>
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
            <StyledLabelLarge sx={{ ml: theme.spacing(0.8), color: variables.palette.on_surface }}>
              {t('prolific.prolificConnectionStatus')}
            </StyledLabelLarge>
          </StyledStatusChip>
        )}
        <StyledTitleMedium
          sx={{
            color: variables.palette.on_surface,
            mb: theme.spacing(1.2),
          }}
        >
          {t('prolific.description')}
        </StyledTitleMedium>
        <StyledLinkConfiguration onClick={() => {}}>
          {t('prolific.viewDashboard')}
        </StyledLinkConfiguration>
        <StyledLinkConfiguration onClick={() => {}}>
          {t('prolific.addStudy')}
        </StyledLinkConfiguration>
        <StyledLinkConfiguration onClick={() => {}}>
          {t('prolific.disconnect')}
        </StyledLinkConfiguration>
      </Box>
      <StyledFlexAllCenter>
        {!apiTokenExists && (
          <Button variant="contained" sx={{ minWidth: '13rem' }} onClick={handleConnect}>
            {t('prolific.connect')}
          </Button>
        )}
      </StyledFlexAllCenter>
      {isConfigurationPopupVisible && (
        <ConfigurationPopup
          open={isConfigurationPopupVisible}
          onClose={() => setIsConfigurationPopupVisible(false)}
          onApiTokenSubmitted={setApiTokenExists}
        />
      )}
    </StyledProlificIntegration>
  );
};
