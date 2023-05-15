import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import Cropper, { ReactCropperElement } from 'react-cropper';

import { Modal } from 'shared/components/Modal';
import { StyledModalWrapper } from 'shared/styles/styledComponents';
import { postFileUploadApi } from 'api';
import { useAsync } from 'shared/hooks';
import { getUploadFormData } from 'shared/utils';

import { StyledCropWrapper } from './CropPopup.styles';
import { CropPopupProps } from './CropPopup.types';
import { cropOptions } from './CropPopup.const';

export const CropPopup = ({ open, setCropPopupVisible, setValue, image }: CropPopupProps) => {
  const { t } = useTranslation('app');
  const cropperRef = useRef<ReactCropperElement>(null);
  const { execute: executeImgUpload } = useAsync(
    postFileUploadApi,
    (response) => response?.data?.result && setValue(response?.data?.result.url),
  );

  const { type, name } = image;

  const handleCropImage = () => {
    const imageElement = cropperRef?.current;
    const cropper = imageElement?.cropper;
    if (!cropper) return;

    cropper.getCroppedCanvas().toBlob((blob) => {
      if (!blob) return;

      const imageFile = new File([blob], name, { type });
      const body = getUploadFormData(imageFile);
      executeImgUpload(body);
    }, type);
  };

  const onClose = () => {
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
            <Cropper ref={cropperRef} src={URL.createObjectURL(image)} {...cropOptions} />
          </StyledCropWrapper>
        </StyledModalWrapper>
      </Modal>
    </>
  );
};
