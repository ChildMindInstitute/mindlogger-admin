import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';

import { AppletPasswordPopup } from 'modules/Dashboard/features/Applet';
import { Modal, Svg } from 'shared/components';
import { applet } from 'shared/state';
import { getExportDataApi } from 'api';
import { useAsync } from 'shared/hooks';
import { useDecryptedActivityData } from 'modules/Dashboard/hooks';
import { exportDataSucceed } from 'shared/utils';
import { StyledBodyLarge, StyledLinearProgress, StyledModalWrapper, theme } from 'shared/styles';

import {
  StyledAppletSettingsButton,
  StyledAppletSettingsDescription,
  StyledHeadline,
} from '../AppletSettings.styles';

export const ExportDataSetting = () => {
  const { t } = useTranslation('app');
  const { result: appletData } = applet.useAppletData() ?? {};
  const getDecryptedAnswers = useDecryptedActivityData();
  const [dataIsExporting, setDataIsExporting] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);

  const { execute } = useAsync(
    getExportDataApi,
    exportDataSucceed({
      getDecryptedAnswers,
      callback: () => {
        setDataIsExporting(false);
      },
    }),
    console.warn,
  );

  const handleDataExportHandler = () => {
    if (!appletData?.id) return;

    setPasswordModalVisible(false);
    setDataIsExporting(true);
    execute({ appletId: appletData.id });
  };
  const handleExportClose = () => {
    setDataIsExporting(false);
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
      {dataIsExporting && (
        <Modal
          open={dataIsExporting}
          onClose={handleExportClose}
          title={t('dataExport')}
          buttonText={''}
        >
          <StyledModalWrapper>
            <StyledBodyLarge sx={{ margin: theme.spacing(-2.4, 0, 2.4) }}>
              {t('waitForRespondentDataDownload')}
            </StyledBodyLarge>
            <StyledLinearProgress />
          </StyledModalWrapper>
        </Modal>
      )}
    </>
  );
};
