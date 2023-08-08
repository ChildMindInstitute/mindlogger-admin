import { MediaType, UploadFileError } from 'shared/consts';

export type IncorrectFilePopupProps = {
  popupVisible: boolean;
  onClose: () => void;
  uiType: UploadFileError;
  fileType: MediaType;
};
