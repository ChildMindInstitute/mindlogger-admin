import { SupplementaryFiles } from '../../ExportDataSetting.types';

export type ExportSettingsPopupProps = {
  isOpen: boolean;
  onClose: () => void;
  onExport: () => void;
  minDate: Date;
  getMaxDate: () => Date;
  appletName: string;
  supportedSupplementaryFiles?: SupplementaryFiles[];
  'data-testid'?: string;
};
