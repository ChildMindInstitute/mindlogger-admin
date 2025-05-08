import { ChosenAppletData } from 'modules/Dashboard/features';
import { SingleApplet } from 'shared/state';
import { ExportDataFilters } from 'shared/utils';
import { UniqueTuple } from 'shared/types';

export const enum ExportDateType {
  AllTime = 'allTime',
  Last24h = 'last24h',
  LastWeek = 'lastWeek',
  LastMonth = 'lastMonth',
  ChooseDates = 'chooseDates',
}

// The list of supplementary files that can be exported. These show up as checkboxes in the modal
// If the appearance of one or more of these checkboxes is controlled by a feature flag, add it
// to that flag's corresponding array, otherwise add it to the `none` array
export const SupplementaryFilesWithFeatureFlag = {
  enableEmaExtraFiles: ['flowHistory', 'scheduleHistory'],
  // none: [],
} as const;

export const SupplementaryFiles = [
  ...SupplementaryFilesWithFeatureFlag.enableEmaExtraFiles,
  //...SupplementaryFilesWithFeatureFlag.none,
] as const;

export type SupplementaryFiles = (typeof SupplementaryFiles)[number];

export type SupplementaryFilesFormValues = {
  [key in SupplementaryFiles]: boolean;
};

export type ExportDataFormValues = {
  dateType: ExportDateType;
  fromDate: Date;
  toDate: Date;
  supplementaryFiles: SupplementaryFilesFormValues;
};

export type ExportDataSettingProps = {
  isExportSettingsOpen: boolean;
  onExportSettingsClose: () => void;
  onDataExportPopupClose?: () => void;
  chosenAppletData?: ChosenAppletData | SingleApplet | null;
  isAppletSetting?: boolean;
  filters?: ExportDataFilters;
  supportedSupplementaryFiles?: UniqueTuple<SupplementaryFiles> | [];
};
