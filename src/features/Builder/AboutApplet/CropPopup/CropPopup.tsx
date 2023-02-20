import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import Cropper, { ReactCropperElement } from 'react-cropper';

import { Modal } from 'components';
import { StyledModalWrapper } from 'styles/styledComponents';

import { StyledCropWrapper } from './CropPopup.styles';
import { CropPopupProps } from './CropPopup.types';

export const CropPopup = ({
  open,
  setCropPopupVisible,
  name,
  setValue,
  imageUrl,
}: CropPopupProps) => {
  const { t } = useTranslation('app');
  const cropperRef = useRef<ReactCropperElement>(null);

  const handleCropImage = () => {
    const imageElement = cropperRef?.current;
    const cropper = imageElement?.cropper;
    cropper && setValue(name, cropper.getCroppedCanvas().toDataURL());
  };

  const onClose = () => {
    handleCropImage();
    setCropPopupVisible(false);
  };

  const handleSave = () => {
    handleCropImage();
    onClose();
  };

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        title="Please select area to display"
        onSubmit={handleSave}
        buttonText={t('save')}
      >
        <StyledModalWrapper>
          <StyledCropWrapper>
            <Cropper
              ref={cropperRef}
              initialAspectRatio={1}
              src={imageUrl}
              viewMode={3}
              minCropBoxHeight={50}
              minCropBoxWidth={50}
              background={false}
              responsive={true}
              autoCropArea={1}
              checkOrientation={true}
              guides={false}
              zoomable={false}
            />
          </StyledCropWrapper>
        </StyledModalWrapper>
      </Modal>
    </>
  );
};
