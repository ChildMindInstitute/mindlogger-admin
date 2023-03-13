import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import Cropper, { ReactCropperElement } from 'react-cropper';

import { Modal } from 'shared/components';
import { StyledModalWrapper } from 'shared/styles/styledComponents';

import { StyledCropWrapper } from './CropPopup.styles';
import { CropPopupProps } from './CropPopup.types';
import { cropOptions } from './CropPopup.const';

export const CropPopup = ({ open, setCropPopupVisible, setValue, imageUrl }: CropPopupProps) => {
  const { t } = useTranslation('app');
  const cropperRef = useRef<ReactCropperElement>(null);

  const handleCropImage = () => {
    const imageElement = cropperRef?.current;
    const cropper = imageElement?.cropper;
    cropper && setValue(cropper.getCroppedCanvas().toDataURL());
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
        title={t('pleaseSelectArea')}
        onSubmit={handleSave}
        buttonText={t('save')}
      >
        <StyledModalWrapper>
          <StyledCropWrapper>
            <Cropper ref={cropperRef} src={imageUrl} {...cropOptions} />
          </StyledCropWrapper>
        </StyledModalWrapper>
      </Modal>
    </>
  );
};
