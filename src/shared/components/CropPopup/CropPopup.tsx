import { useState, useMemo, SyntheticEvent } from 'react';
import { useTranslation } from 'react-i18next';
import ReactCrop, { Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

import { Modal } from 'shared/components/Modal';
import { StyledModalWrapper } from 'shared/styles/styledComponents';
import { getUploadFormData } from 'shared/utils/getUploadFormData';

import { cropImage, initPercentCrop } from './CropPopup.utils';
import { SIZE_TO_SET_IMG_SMALL, CropRatio } from './CropPopup.const';
import { StyledCropWrapper } from './CropPopup.styles';
import { CropPopupProps } from './CropPopup.types';

export const CropPopup = ({
  open,
  image,
  ratio = CropRatio.Default,
  onSave,
  onClose,
  'data-testid': dataTestid,
  flexibleCropRatio,
}: CropPopupProps) => {
  const { t } = useTranslation('app');
  const [crop, setCrop] = useState<Crop>();
  const [isSmallImg, setIsSmallImg] = useState(false);
  const imgSrc = useMemo(() => URL.createObjectURL(image), [image]);

  const { type, name } = image;

  const handleImageLoad = (event: SyntheticEvent<HTMLImageElement, Event>) => {
    const { naturalWidth: width, naturalHeight: height } = event.currentTarget;

    setIsSmallImg(width < SIZE_TO_SET_IMG_SMALL || height < SIZE_TO_SET_IMG_SMALL);

    const calculatedRatio = flexibleCropRatio ? width / height : ratio;
    const crop = initPercentCrop({ width, height, ratio: calculatedRatio });
    setCrop(crop);
  };

  const handleCropImage = () => {
    cropImage({
      image: imgSrc,
      type,
      crop,
      onReady: (blob) => {
        const imageFile = new File([blob], name, { type });
        const body = getUploadFormData(imageFile);
        onSave(body);
      },
    });
  };

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        title={t('pleaseSelectArea')}
        onSubmit={handleCropImage}
        buttonText={t('save')}
        data-testid={dataTestid}
      >
        <StyledModalWrapper sx={{ margin: '0 auto' }}>
          <StyledCropWrapper isSmallImg={isSmallImg}>
            <ReactCrop
              crop={crop}
              onChange={(_, percentCrop) => setCrop(percentCrop)}
              aspect={flexibleCropRatio ? undefined : ratio}
              keepSelection={true}
              style={{ maxHeight: '60vh' }}
            >
              <img src={imgSrc} onLoad={handleImageLoad} alt={name} />
            </ReactCrop>
          </StyledCropWrapper>
        </StyledModalWrapper>
      </Modal>
    </>
  );
};
