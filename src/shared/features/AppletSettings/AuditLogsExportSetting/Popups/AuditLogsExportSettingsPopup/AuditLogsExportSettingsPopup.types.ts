export type AuditLogsExportSettingsPopupProps = {
  isOpen: boolean;
  onClose: () => void;
  onExport: () => void;
  minDate: Date;
  maxDate: Date;
  'data-testid'?: string;
  contextItemName: string;
};
