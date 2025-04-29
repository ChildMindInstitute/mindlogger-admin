import { ChosenAppletData } from 'modules/Dashboard/features';
import { SingleApplet } from 'shared/state';
import { ExportDataFilters } from 'shared/utils';

export const enum ExportDateType {
  AllTime = 'allTime',
  Last24h = 'last24h',
  LastWeek = 'lastWeek',
  LastMonth = 'lastMonth',
  ChooseDates = 'chooseDates',
}

export type ExportDataFormValues = {
  dateType: ExportDateType;
  fromDate: Date;
  toDate: Date;
};

export type ExportDataSettingProps = {
  isExportSettingsOpen: boolean;
  onExportSettingsClose: () => void;
  onDataExportPopupClose?: () => void;
  chosenAppletData?: ChosenAppletData | SingleApplet | null;
  isAppletSetting?: boolean;
  filters?: ExportDataFilters;
};
