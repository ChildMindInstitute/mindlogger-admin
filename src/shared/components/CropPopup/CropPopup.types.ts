import { Crop } from 'react-image-crop';

import { ExecuteMediaUploadProps } from 'shared/hooks/useMediaUpload';

import { CropRatio } from './CropPopup.const';

export type CropPopupProps = {
  open: boolean;
  image: File;
  ratio?: CropRatio;
  onSave: ({ file, fileName }: ExecuteMediaUploadProps) => void;
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
