import { SupplementaryFiles } from '../../ExportDataSetting.types';

export type ExportSettingsPopupProps = {
  isOpen: boolean;
  onClose: () => void;
  onExport: () => void;
  minDate: Date;
  maxDate: Date;
  contextItemName: string; // Activity name or Activity Flow name or Applet name
  supportedSupplementaryFiles?: SupplementaryFiles[];
  canExportEhrHealthData?: boolean;
  'data-testid'?: string;
};
