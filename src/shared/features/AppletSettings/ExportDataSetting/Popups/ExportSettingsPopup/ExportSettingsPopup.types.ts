import { SupplementaryFiles } from '../../ExportDataSetting.types';

export type ExportSettingsPopupProps = {
  isOpen: boolean;
  onClose: () => void;
  onExport: () => void;
  minDate: Date;
  maxDate: Date;
  appletName: string;
  supportedSupplementaryFiles?: SupplementaryFiles[];
  canExportEhrHealthData?: boolean;
  'data-testid'?: string;
};
