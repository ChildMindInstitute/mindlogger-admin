import { Crop } from 'react-image-crop';

export type CropPopupProps = {
  open: boolean;
  setCropPopupVisible: (val: boolean) => void;
  setValue: (value: string) => void;
  image: File;
  ratio?: number;
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
