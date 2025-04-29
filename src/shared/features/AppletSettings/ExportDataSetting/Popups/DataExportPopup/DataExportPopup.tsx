import { useFeatureFlags } from 'shared/hooks/useFeatureFlags';

import { DataExportPopup as DataExportPopupOld } from 'shared/features/AppletSettings/ExportDataSetting/Popups/DataExportPopup/DataExportPopup_old';
import { DataExportPopup as DataExportPopupNew } from 'shared/features/AppletSettings/ExportDataSetting/Popups/DataExportPopup/DataExportPopup_new';
import { DataExportPopupProps } from 'shared/features/AppletSettings/ExportDataSetting/Popups/DataExportPopup/DataExportPopup.types';

/**
 * Do not consume this component directly. Please use {@link ExportDataSetting} instead
 * @param props
 * @constructor
 */
export const DataExportPopup = (props: DataExportPopupProps) => {
  const {
    featureFlags: { enableDataExportSpeedUp },
  } = useFeatureFlags();

  return enableDataExportSpeedUp ? (
    <DataExportPopupNew {...props} />
  ) : (
    <DataExportPopupOld {...props} />
  );
};
