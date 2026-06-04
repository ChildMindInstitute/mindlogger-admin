export type AuditLogsExportPopupProps = {
  popupVisible: boolean;
  setPopupVisible: (visible: boolean) => void;
  handlePopupClose: () => void;
  'data-testid'?: string;
};
