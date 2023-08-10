import { Dispatch, SetStateAction } from 'react';
import { Crop } from 'react-image-crop';

export type CropPopupProps = {
  open: boolean;
  setValue: (value: string) => void;
  image: File;
  ratio?: number;
  onSave: (data: FormData) => void;
  onClose: () => void;
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
