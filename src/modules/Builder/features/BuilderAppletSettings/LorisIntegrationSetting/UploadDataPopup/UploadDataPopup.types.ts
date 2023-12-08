export type UploadDataPopupProps = {
  open: boolean;
  onClose: () => void;
  'data-testid'?: string;
};
export type ScreenParams = {
  onSubmit: () => void;
  onClose: () => void;
};
export enum Steps {
  First,
  Second,
}
