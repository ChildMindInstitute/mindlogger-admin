import { SupplementaryFiles } from '../../ExportDataSetting.types';

export type ExportSettingsPopupProps = {
  isOpen: boolean;
  onClose: () => void;
  onExport: () => void;
  minDate: Date;
  getMaxDate: () => Date;
  appletName: string;
  activityName?: string;
  supportedSupplementaryFiles?: SupplementaryFiles[];
  hasEhrHealthData?: boolean;
  'data-testid'?: string;
};
