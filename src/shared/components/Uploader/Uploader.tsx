import { ChangeEvent, DragEvent, MouseEvent, useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { CropPopup } from 'shared/components/CropPopup';
import { Svg } from 'shared/components/Svg';
import { Spinner, SpinnerUiType } from 'shared/components/Spinner';
import { StyledBodyMedium } from 'shared/styles/styledComponents';
import theme from 'shared/styles/theme';
import { byteFormatter } from 'shared/utils/fileSystem';
import { concatIf } from 'shared/utils/concatIf';
import { joinWihComma } from 'shared/utils/joinWihComma';
import { getMediaName } from 'shared/utils/getMediaName';
import {
  MAX_FILE_SIZE_25MB,
  VALID_IMAGE_TYPES,
  UploadFileError,
  MediaType,
  MAX_IMAGE_WIDTH,
  MIN_IMAGE_WIDTH,
  MIN_IMAGE_HEIGHT,
  MAX_IMAGE_HEIGHT,
} from 'shared/consts';
import { ExecuteMediaUploadProps, useMediaUpload } from 'shared/hooks/useMediaUpload';
import { useAppDispatch } from 'redux/store';
import { banners } from 'redux/modules';

import {
  StyledContainer,
  StyledError,
  StyledImgContainer,
  StyledName,
  StyledNameWrapper,
  StyledUploadImg,
  UploadedImgContainer,
} from './Uploader.styles';
import { UploaderProps, UploaderUiType } from './Uploader.types';
import { RemoveImagePopup } from './RemoveImagePopup';
import { ActionButtons } from './ActionButtons';

export const Uploader = ({
  uiType = UploaderUiType.Primary,
  width,
  height,
  setValue,
  getValue,
  description,
  wrapperStyles = {},
  cropRatio,
  hasError,
  disabled,
  flexibleCropRatio,
  'data-testid': dataTestid,
}: UploaderProps) => {
  const { t } = useTranslation('app');
  const dispatch = useAppDispatch();
  const uploadInputRef = useRef<HTMLInputElement>(null);
  const [cropPopupVisible, setCropPopupVisible] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [isMouseOver, setIsMouseOver] = useState<boolean>(false);
  const [error, setError] = useState<UploadFileError | null>(null);
  const [isRemovePopupOpen, setRemovePopupOpen] = useState(false);
  const isPrimaryUiType = uiType === UploaderUiType.Primary;
  const isTertiaryUiType = uiType === UploaderUiType.Tertiary;

  const { executeMediaUpload, isLoading } = useMediaUpload({
    callback: (mediaUrl) => setValue(mediaUrl),
  });

  const stopDefaults = (e: DragEvent | MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
  };

  const checkDimensions = (file: File): Promise<boolean> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e: ProgressEvent<FileReader>) => {
        const img = new Image();
        img.onload = () => {
          const { width, height } = img;
          resolve(
            width >= MIN_IMAGE_WIDTH &&
              width <= MAX_IMAGE_WIDTH &&
              height >= MIN_IMAGE_HEIGHT &&
              height <= MAX_IMAGE_HEIGHT,
          );
        };
        img.onerror = reject;
        img.src = (e.target?.result as string) || '';
      };

      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleSetImage = (files: FileList | null) => {
    const imageFile = files?.[0];

    if (!imageFile) return;
    setError(null);

    const fileExtension = imageFile.name.split('.').pop()?.toLowerCase();
    const notAllowableSize = imageFile.size > MAX_FILE_SIZE_25MB;
    const notAllowableType =
      !imageFile.type.includes('image') || !VALID_IMAGE_TYPES.includes(`.${fileExtension}`);

    if (notAllowableSize) {
      if (isPrimaryUiType) {
        setError(UploadFileError.Size);
      } else {
        dispatch(
          banners.actions.addBanner({
            key: 'IncorrectFileBanner',
            bannerProps: {
              errorType: UploadFileError.Size,
              fileType: MediaType.Image,
              onClose: () => setError(null),
            },
          }),
        );
      }
    }

    if (notAllowableType) {
      if (isPrimaryUiType) {
        setError(UploadFileError.Format);
      } else {
        dispatch(
          banners.actions.addBanner({
            key: 'IncorrectFileBanner',
            bannerProps: {
              errorType: UploadFileError.Format,
              fileType: MediaType.Image,
              onClose: () => setError(null),
            },
          }),
        );
      }
    }

    if (notAllowableSize || notAllowableType) return;

    const successSetImageCallback = () => {
      setImage(imageFile);
      setIsMouseOver(false);
      setCropPopupVisible(true);
    };

    if (!flexibleCropRatio) {
      successSetImageCallback();

      return;
    }

    checkDimensions(imageFile)
      .then((allowableDimensions) => {
        if (allowableDimensions) {
          successSetImageCallback();

          return;
        }
        setError(UploadFileError.Dimensions);
      })
      .catch((error) => {
        console.error('Error loading image:', error);
      });
  };

  const dragEvents = {
    onMouseEnter: () => setIsMouseOver(true),
    onMouseLeave: () => setIsMouseOver(false),
    onDragEnter: stopDefaults,
    onDragLeave: stopDefaults,
    onDragOver: stopDefaults,
    onDrop: (e: DragEvent<HTMLElement>) => {
      stopDefaults(e);
      const { files } = e.dataTransfer;

      handleSetImage(files);
    },
  };

  const clearInput = () => {
    if (uploadInputRef.current) {
      uploadInputRef.current.value = '';
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;

    handleSetImage(files);
  };

  const handleRemoveImg = () => {
    setImage(null);
    setValue('');
    clearInput();
  };

  const handleEditImg = (event: MouseEvent) => {
    stopDefaults(event);
    uploadInputRef?.current?.click();
  };

  const handleCloseRemovePopup = () => {
    setRemovePopupOpen(false);
  };

  const handleDeleteClick = (event: MouseEvent) => {
    stopDefaults(event);
    setRemovePopupOpen(true);
  };

  const handleCloseCropPopup = () => {
    setCropPopupVisible(false);
    setImage(null);
    clearInput();
  };

  const handleSaveCroppedImage = async ({ file, fileName }: ExecuteMediaUploadProps) => {
    setCropPopupVisible(false);
    await executeMediaUpload({ file, fileName });
    setImage(null);
    clearInput();
  };

  const imageField = getValue();

  const placeholderImgId = isPrimaryUiType ? 'img-filled' : 'img-outlined';
  const placeholderImgSize = isPrimaryUiType ? 32 : 24;
  const hasSizeError = error === UploadFileError.Size;
  const hasFormatError = error === UploadFileError.Format;
  const hasDimensionsError = error === UploadFileError.Dimensions;
  const hasImageError = hasSizeError || hasFormatError || hasDimensionsError;
  const spinnerUiType = isPrimaryUiType ? SpinnerUiType.Primary : SpinnerUiType.Secondary;
  const fileName = getMediaName(imageField) || image?.name || '';

  return (
    <>
      <StyledContainer
        data-testid={dataTestid}
        hasError={hasError}
        width={width}
        height={height}
        isImgUploaded={!!imageField}
        isPrimaryUiType={isPrimaryUiType}
        disabled={disabled}
        onClick={() => uploadInputRef?.current?.click()}
        sx={{ ...wrapperStyles }}
        type="button"
        {...dragEvents}
      >
        {isLoading && <Spinner uiType={spinnerUiType} />}
        {imageField && !hasImageError ? (
          <UploadedImgContainer isPrimaryUiType={isPrimaryUiType} width={width} height={height}>
            <StyledUploadImg alt="file upload" src={imageField} isPrimaryUiType={isPrimaryUiType} />
            {isMouseOver && (
              <ActionButtons
                isPrimaryUiType={isPrimaryUiType}
                showFirstButton={isPrimaryUiType || isTertiaryUiType}
                showSecondButton={!isTertiaryUiType}
                onEditImg={handleEditImg}
                onDeleteImg={handleDeleteClick}
              />
            )}
          </UploadedImgContainer>
        ) : (
          <StyledImgContainer
            className="image-container"
            isPrimaryUiType={isPrimaryUiType}
            hasError={hasError}
          >
            <Svg id={placeholderImgId} width={placeholderImgSize} height={placeholderImgSize} />
            {isPrimaryUiType && (
              <>
                {hasSizeError && (
                  <StyledError>
                    <Trans i18nKey="dropError">
                      Image is more than <br /> <>{{ size: byteFormatter(MAX_FILE_SIZE_25MB) }}</>.
                    </Trans>
                  </StyledError>
                )}
                {hasFormatError && <StyledError>{t('incorrectImageFormat')}</StyledError>}
                {hasDimensionsError && <StyledError>{t('incorrectImageDimensions')}</StyledError>}
                <StyledBodyMedium>
                  <Trans i18nKey="dropImg">
                    Drop Image here <br /> or <span>click to browse</span>.
                  </Trans>
                </StyledBodyMedium>
              </>
            )}
          </StyledImgContainer>
        )}
      </StyledContainer>
      <input
        ref={uploadInputRef}
        onChange={handleChange}
        accept={joinWihComma(VALID_IMAGE_TYPES)}
        type="file"
        name="uploadFile"
        hidden
        data-testid="upload-file"
      />
      {isPrimaryUiType && (
        <StyledNameWrapper>
          {fileName ? (
            <>
              <StyledName sx={{ marginRight: theme.spacing(0.4) }}>{fileName}</StyledName>{' '}
              <Svg id="check" width={18} height={18} />
            </>
          ) : (
            description
          )}
        </StyledNameWrapper>
      )}
      {cropPopupVisible && image && (
        <CropPopup
          open={cropPopupVisible}
          image={image}
          ratio={cropRatio}
          onSave={handleSaveCroppedImage}
          onClose={handleCloseCropPopup}
          data-testid={concatIf(dataTestid, '-crop-popup')}
          flexibleCropRatio={flexibleCropRatio}
        />
      )}
      {isRemovePopupOpen && (
        <RemoveImagePopup
          open={isRemovePopupOpen}
          onClose={handleCloseRemovePopup}
          onRemove={handleRemoveImg}
          data-testid={concatIf(dataTestid, '-remove-popup')}
        />
      )}
    </>
  );
};
