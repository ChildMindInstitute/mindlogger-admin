export type SaveChangesPopupProps = {
  isPopupVisible: boolean;
  handleClose: () => void;
  handleDoNotSaveSubmit: () => void;
  handleSaveSubmit: () => void;
  'data-testid'?: string;
};
