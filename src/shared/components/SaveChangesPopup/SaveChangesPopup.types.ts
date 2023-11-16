export type SaveChangesPopupProps = {
  popupVisible: boolean;
  onDontSave: () => void;
  onCancel: () => void;
  onSave: () => void;
  'data-testid'?: string;
};
