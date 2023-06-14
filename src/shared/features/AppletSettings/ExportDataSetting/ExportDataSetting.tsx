import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';

import { AppletPasswordPopup } from 'modules/Dashboard/features/Applet';
import { Svg } from 'shared/components';
import { applet } from 'shared/state';
import { getExportDataApi } from 'api';
import { useAsync } from 'shared/hooks';
import { useDecryptedActivityData } from 'modules/Dashboard/hooks';
import { exportTemplate, prepareData } from 'shared/utils';
import { GENERAL_REPORT_NAME } from 'shared/consts';

import {
  StyledAppletSettingsButton,
  StyledAppletSettingsDescription,
  StyledHeadline,
} from '../AppletSettings.styles';

export const ExportDataSetting = () => {
  const { t } = useTranslation('app');
  const { result: appletData } = applet.useAppletData() ?? {};
  const getDecryptedAnswers = useDecryptedActivityData();

  const [passwordModalVisible, setPasswordModalVisible] = useState(false);

  const { execute } = useAsync(getExportDataApi, (res) => {
    if (!res?.data?.result) return;

    const { reportData } = prepareData(res.data.result, getDecryptedAnswers);
    exportTemplate(reportData, GENERAL_REPORT_NAME);
    setPasswordModalVisible(false);
  });

  const handleDataExportHandler = () => {
    if (appletData?.id) {
      execute({ appletId: appletData.id });
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
          submitCallback={handleDataExportHandler}
          appletId={appletData?.id ?? ''}
          encryption={appletData?.encryption}
        />
      )}
    </>
  );
};
