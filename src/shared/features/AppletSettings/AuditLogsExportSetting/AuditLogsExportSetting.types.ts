import { ChosenAppletData } from 'modules/Dashboard/features';
import { DateRangePickerFormValues } from 'shared/components/DateRangePicker';
import { SingleApplet } from 'shared/state';

/** Checkbox field segment under `supplementaryFiles` */
export const AUDIT_LOGS_SUPPLEMENTARY_FILE_KEY = 'tsv' as const;

export type AuditLogsSupplementaryFilesFormValues = {
  [AUDIT_LOGS_SUPPLEMENTARY_FILE_KEY]: boolean;
};

export type AuditLogsExportFormValues = DateRangePickerFormValues & {
  supplementaryFiles: AuditLogsSupplementaryFilesFormValues;
};

export type AuditLogsExportSettingProps = {
  isExportSettingsOpen: boolean;
  onExportSettingsClose: () => void;
  onExportPopupClose: () => void;
  'data-testid'?: string;
  chosenAppletData?: ChosenAppletData | SingleApplet | null;
};
