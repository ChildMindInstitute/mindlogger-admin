import { Crop } from 'react-image-crop';

import { CropRatio } from './CropPopup.const';

export type CropPopupProps = {
  open: boolean;
  image: File;
  ratio?: CropRatio;
  onSave: (data: FormData) => void;
  onClose: () => void;
  'data-testid'?: string;
  flexibleCropRatio?: boolean;
};

export type CropImage = {
  image: string;
  type: string;
  crop?: Crop;
  onReady: (blob: Blob) => void;
};

export type InitCrop = {
  width: number;
  height: number;
  ratio: number;
};
