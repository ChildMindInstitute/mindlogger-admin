import { ChosenAppletData } from 'modules/Dashboard/features';
import { DateRangePickerFormValues } from 'shared/components/DateRangePicker';
import { SingleApplet } from 'shared/state';

export type AuditLogsExportFormValues = DateRangePickerFormValues;

export type AuditLogsExportSettingProps = {
  isExportSettingsOpen: boolean;
  onExportSettingsClose: () => void;
  onExportPopupClose: () => void;
  'data-testid'?: string;
  chosenAppletData?: ChosenAppletData | SingleApplet | null;
};
