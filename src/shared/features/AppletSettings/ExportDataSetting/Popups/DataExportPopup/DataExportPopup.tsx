import { useFeatureFlags } from 'shared/hooks/useFeatureFlags';

import { DataExportPopup as DataExportPopupOld } from './DataExportPopup_old';
import { DataExportPopup as DataExportPopupNew } from './DataExportPopup_new';
import { DataExportPopupProps } from './DataExportPopup.types';

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
