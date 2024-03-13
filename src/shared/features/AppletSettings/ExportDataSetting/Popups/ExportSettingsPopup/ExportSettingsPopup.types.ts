export type ExportSettingsPopupProps = {
  isOpen: boolean;
  onClose: () => void;
  onExport: () => void;
  minDate: Date;
  getMaxDate: () => Date;
};
