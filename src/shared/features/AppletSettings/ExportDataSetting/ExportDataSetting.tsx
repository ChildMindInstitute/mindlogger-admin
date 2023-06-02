import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Box } from '@mui/material';

import { AppletPasswordPopup } from 'modules/Dashboard/features/Applet';
import { Svg } from 'shared/components';
import { applet } from 'shared/state';
import { getExportDataApi } from 'api';
import { useAsync } from 'shared/hooks';

import {
  StyledAppletSettingsButton,
  StyledAppletSettingsDescription,
  StyledHeadline,
} from '../AppletSettings.styles';

export const ExportDataSetting = () => {
  const { t } = useTranslation('app');
  const { appletId } = useParams();
  const { result: appletData } = applet.useAppletData() ?? {};
  const encryption = appletData?.encryption;

  const [passwordModalVisible, setPasswordModalVisible] = useState(false);

  const { execute } = useAsync(getExportDataApi, () => setPasswordModalVisible(false));

  const handleDataExportHandler = () => {
    if (appletId) {
      execute({ appletId });
    }
  };

  return (
    <>
      <StyledHeadline>{t('exportData')}</StyledHeadline>
      <StyledAppletSettingsDescription>{t('exportDescription')}</StyledAppletSettingsDescription>
      <Box sx={{ width: 'fit-content' }}>
        <StyledAppletSettingsButton
          onClick={() => setPasswordModalVisible(true)}
          variant="outlined"
          startIcon={<Svg width="18" height="18" id="export" />}
        >
          {t('download')}
        </StyledAppletSettingsButton>
      </Box>
      {passwordModalVisible && (
        <AppletPasswordPopup
          popupVisible={passwordModalVisible}
          onClose={() => setPasswordModalVisible(false)}
          appletId={appletId ?? ''}
          encryption={encryption}
          submitCallback={handleDataExportHandler}
        />
      )}
    </>
  );
};
