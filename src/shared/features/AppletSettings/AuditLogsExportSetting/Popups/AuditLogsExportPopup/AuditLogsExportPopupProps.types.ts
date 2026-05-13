export type AuditLogsExportPopupProps = {
  appletId: string;
  popupVisible: boolean;
  setPopupVisible: (visible: boolean) => void;
  handlePopupClose: () => void;
  'data-testid'?: string;
};
