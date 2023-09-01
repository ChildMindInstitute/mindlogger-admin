import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';

import { DataExportPopup } from 'modules/Dashboard/features/Respondents/Popups';
import { Svg } from 'shared/components';
import { applet } from 'shared/state';

import {
  StyledAppletSettingsButton,
  StyledAppletSettingsDescription,
} from '../AppletSettings.styles';

export const ExportDataSetting = () => {
  const { t } = useTranslation('app');
  const { result: appletData } = applet.useAppletData() ?? {};

  const [dataIsExporting, setDataIsExporting] = useState(false);

  const dataTestid = 'applet-settings-export-data-export';

  return (
    <>
      <StyledAppletSettingsDescription>{t('exportDescription')}</StyledAppletSettingsDescription>
      <Box sx={{ width: 'fit-content' }}>
        <StyledAppletSettingsButton
          onClick={() => setDataIsExporting(true)}
          variant="outlined"
          startIcon={<Svg width="18" height="18" id="export" />}
          data-testid={dataTestid}
        >
          {t('download')}
        </StyledAppletSettingsButton>
      </Box>
      {dataIsExporting && (
        <DataExportPopup
          isAppletSetting
          popupVisible={dataIsExporting}
          setPopupVisible={setDataIsExporting}
          chosenAppletData={appletData ?? null}
          data-testid={`${dataTestid}-popup`}
        />
      )}
    </>
  );
};
