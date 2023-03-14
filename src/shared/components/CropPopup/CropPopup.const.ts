import { ViewMode } from './CropPopup.types';

export const cropOptions = {
  initialAspectRatio: 1,
  viewMode: 3 as ViewMode,
  minCropBoxHeight: 50,
  minCropBoxWidth: 50,
  background: false,
  responsive: true,
  autoCropArea: 1,
  checkOrientation: true,
  guides: false,
  zoomable: false,
};
