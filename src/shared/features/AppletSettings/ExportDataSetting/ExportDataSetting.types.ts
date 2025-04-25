import { ChosenAppletData } from 'modules/Dashboard/features';
import { SingleApplet } from 'shared/state';

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
  chosenAppletData?: ChosenAppletData | SingleApplet | null;
  isAppletSetting?: boolean;
};
