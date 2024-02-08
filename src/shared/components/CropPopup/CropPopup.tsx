import { useState, useMemo, SyntheticEvent } from 'react';

import { useTranslation } from 'react-i18next';
import ReactCrop, { Crop, PixelCrop, PercentCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

import { Modal } from 'shared/components/Modal';
import { StyledModalWrapper } from 'shared/styles/styledComponents';

import { CropRatio, MIN_CROP_SIZE } from './CropPopup.const';
import { StyledCropWrapper } from './CropPopup.styles';
import { CropPopupProps } from './CropPopup.types';
import { checkIfImageSmall, cropImage, initPercentCrop } from './CropPopup.utils';

export const CropPopup = ({
  open,
  image,
  ratio = CropRatio.Default,
  onSave,
  onClose,
  flexibleCropRatio,
  'data-testid': dataTestid,
}: CropPopupProps) => {
  const { t } = useTranslation('app');
  const [crop, setCrop] = useState<Crop>();
  const [isSmallImg, setIsSmallImg] = useState(false);
  const imgSrc = useMemo(() => URL.createObjectURL(image), [image]);

  const { type, name } = image;

  const handleImageLoad = (event: SyntheticEvent<HTMLImageElement, Event>) => {
    const { naturalWidth: width, naturalHeight: height } = event.currentTarget;
    setIsSmallImg(checkIfImageSmall(width, height));
    const crop = initPercentCrop({ width, height, ratio });
    setCrop(crop);
  };

  const handleCropImage = () => {
    cropImage({
      image: imgSrc,
      type,
      crop,
      onReady: (blob) => {
        const file = new File([blob], name, { type });
        onSave({ file, fileName: name });
      },
    });
  };

  const handleCropChange = ({ width, height }: PixelCrop, percentCrop: PercentCrop) => {
    setCrop(percentCrop);
    setIsSmallImg(checkIfImageSmall(width, height));
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
              onChange={handleCropChange}
              aspect={flexibleCropRatio ? undefined : ratio}
              keepSelection={true}
              style={{ maxHeight: '60vh' }}
              minWidth={MIN_CROP_SIZE}
              minHeight={MIN_CROP_SIZE}
            >
              <img src={imgSrc} onLoad={handleImageLoad} alt={name} />
            </ReactCrop>
          </StyledCropWrapper>
        </StyledModalWrapper>
      </Modal>
    </>
  );
};
