import { centerCrop, makeAspectCrop } from 'react-image-crop';

import { SIZE_TO_SET_IMG_SMALL } from './CropPopup.const';
import { CropImage, InitCrop } from './CropPopup.types';

export const getAbsoluteFromPercent = (basis: number, percent: number) => (basis / 100) * percent;

export const cropImage = ({ image, type, crop, onReady }: CropImage) => {
  if (!crop) return;

  const originalImage = new Image();
  originalImage.src = image;

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  originalImage.addEventListener('load', function () {
    const { width: originalWidth, height: originalHeight } = originalImage;

    const x = getAbsoluteFromPercent(originalWidth, crop.x);
    const y = getAbsoluteFromPercent(originalHeight, crop.y);
    const width = getAbsoluteFromPercent(originalWidth, crop.width);
    const height = getAbsoluteFromPercent(originalHeight, crop.height);

    canvas.width = width;
    canvas.height = height;

    ctx?.drawImage(originalImage, x, y, width, height, 0, 0, width, height);
    canvas.toBlob(blob => {
      if (!blob) return;

      onReady(blob);
    }, type);
  });
};

export const initPercentCrop = ({ width, height, ratio }: InitCrop) =>
  centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 100,
      },
      ratio,
      width,
      height,
    ),
    width,
    height,
  );

export const checkIfImageSmall = (width: number, height: number): boolean =>
  width < SIZE_TO_SET_IMG_SMALL || height < SIZE_TO_SET_IMG_SMALL;
