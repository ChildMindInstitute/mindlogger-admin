import { useState } from 'react';

import { DataExportPopup } from 'modules/Dashboard/features/Respondents/Popups';
import { applet } from 'shared/state';

import { ExportDataSettingProps } from './ExportDataSetting.types';
import { ExportSettingsPopup } from './Popups/ExportSettingsPopup/ExportSettingsPopup';
import { DATA_TESTID_EXPORT_DATA_EXPORT_POPUP } from './ExportDataSetting.const';

export const ExportDataSetting = ({
  isExportSettingsOpen,
  onExportSettingsClose,
}: ExportDataSettingProps) => {
  const { result: appletData } = applet.useAppletData() ?? {};
  const [dataIsExporting, setDataIsExporting] = useState(false);

  return (
    <>
      <ExportSettingsPopup
        isOpen={isExportSettingsOpen}
        onClose={onExportSettingsClose}
        onExport={() => {
          setDataIsExporting(true);
          onExportSettingsClose();
        }}
      />
      {dataIsExporting && (
        <DataExportPopup
          isAppletSetting
          popupVisible={dataIsExporting}
          setPopupVisible={setDataIsExporting}
          chosenAppletData={appletData ?? null}
          data-testid={DATA_TESTID_EXPORT_DATA_EXPORT_POPUP}
        />
      )}
    </>
  );
};
