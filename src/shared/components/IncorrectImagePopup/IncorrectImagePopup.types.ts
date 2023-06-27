import { UploadImageError } from 'shared/consts';

export type IncorrectImagePopupProps = {
  popupVisible: boolean;
  onClose: () => void;
  uiType: UploadImageError;
};
