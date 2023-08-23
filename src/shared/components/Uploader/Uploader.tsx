import { ChangeEvent, DragEvent, MouseEvent, useRef, useState } from 'react';
import { Button } from '@mui/material';
import { Trans, useTranslation } from 'react-i18next';

import { postFileUploadApi } from 'api';
import { CropPopup } from 'shared/components/CropPopup';
import { Svg } from 'shared/components/Svg';
import { Spinner, SpinnerUiType } from 'shared/components/Spinner';
import { IncorrectFilePopup } from 'shared/components/IncorrectFilePopup';
import { StyledBodyMedium } from 'shared/styles/styledComponents';
import theme from 'shared/styles/theme';
import { byteFormatter, joinWihComma } from 'shared/utils';
import { MAX_FILE_SIZE_25MB, VALID_IMAGE_TYPES, UploadFileError, MediaType } from 'shared/consts';
import { useAsync } from 'shared/hooks';

import {
  StyledButtonGroup,
  StyledContainer,
  StyledDeleteBtn,
  StyledError,
  StyledImgContainer,
  StyledName,
  StyledNameWrapper,
  StyledUploadImg,
  UploadedImgContainer,
} from './Uploader.styles';
import { UploaderProps, UploaderUiType } from './Uploader.types';
import { RemoveImagePopup } from './RemoveImagePopup';

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
}: UploaderProps) => {
  const { t } = useTranslation('app');
  const uploadInputRef = useRef<HTMLInputElement>(null);
  const [cropPopupVisible, setCropPopupVisible] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [isMouseOver, setIsMouseOver] = useState<boolean>(false);
  const [error, setError] = useState<UploadFileError | null>(null);
  const [isRemovePopupOpen, setRemovePopupOpen] = useState(false);
  const isPrimaryUiType = uiType === UploaderUiType.Primary;

  const { execute: executeImgUpload, isLoading } = useAsync(
    postFileUploadApi,
    (response) => response?.data?.result && setValue(response?.data?.result.url),
  );

  const stopDefaults = (e: DragEvent | MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
  };

  const handleSetImage = (files: FileList | null) => {
    const imageFile = files?.[0];
    if (!imageFile) return;
    setError(null);

    const fileExtension = imageFile.name.split('.').pop()?.toLowerCase();
    const notAllowableSize = imageFile.size > MAX_FILE_SIZE_25MB;
    const notAllowableType =
      !imageFile.type.includes('image') || !VALID_IMAGE_TYPES.includes(`.${fileExtension}`);
    notAllowableSize && setError(UploadFileError.Size);
    notAllowableType && setError(UploadFileError.Format);

    if (notAllowableSize || notAllowableType) return;

    setImage(imageFile);
    setCropPopupVisible(true);
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

  const onEditImg = (e: MouseEvent) => {
    stopDefaults(e);
    handleRemoveImg();
    uploadInputRef?.current?.click();
  };

  const handleCloseRemovePopup = () => {
    setRemovePopupOpen(false);
  };

  const handleDeleteClick = (e: MouseEvent) => {
    stopDefaults(e);
    setRemovePopupOpen(true);
  };

  const handleConfirmRemoval = () => {
    handleRemoveImg();
    handleCloseRemovePopup();
  };

  const handleCloseCropPopup = () => {
    setCropPopupVisible(false);
    setImage(null);
    clearInput();
  };

  const handleSaveCroppedImage = async (file: FormData) => {
    setCropPopupVisible(false);
    await executeImgUpload(file);
    setImage(null);
    clearInput();
  };

  const imageField = getValue();

  const placeholderImgId = isPrimaryUiType ? 'img-filled' : 'img-outlined';
  const placeholderImgSize = isPrimaryUiType ? 32 : 24;
  const deleteSvgSize = isPrimaryUiType ? '18' : '24';
  const hasSizeError = error === UploadFileError.Size;
  const hasFormatError = error === UploadFileError.Format;
  const spinnerUiType = isPrimaryUiType ? SpinnerUiType.Primary : SpinnerUiType.Secondary;

  const fileName = imageField?.split('/').at(-1) || image?.name || '';

  return (
    <>
      <StyledContainer
        hasError={hasError}
        width={width}
        height={height}
        isImgUploaded={!!imageField}
        isPrimaryUiType={isPrimaryUiType}
        disabled={disabled}
        onClick={() => uploadInputRef?.current?.click()}
        sx={{ ...wrapperStyles }}
        {...dragEvents}
      >
        {isLoading && <Spinner uiType={spinnerUiType} />}
        {imageField ? (
          <UploadedImgContainer isPrimaryUiType={isPrimaryUiType} width={width} height={height}>
            <StyledUploadImg alt="file upload" src={imageField} isPrimaryUiType={isPrimaryUiType} />
            {isMouseOver && (
              <StyledButtonGroup
                isPrimaryUiType={isPrimaryUiType}
                variant="outlined"
                aria-label="button group"
              >
                {isPrimaryUiType && (
                  <Button
                    startIcon={<Svg width="18" height="18" id="edit" />}
                    onClick={onEditImg}
                  />
                )}
                <StyledDeleteBtn isPrimaryUiType={isPrimaryUiType} onClick={handleDeleteClick}>
                  <Svg width={deleteSvgSize} height={deleteSvgSize} id="trash" />
                </StyledDeleteBtn>
              </StyledButtonGroup>
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
        />
      )}
      <RemoveImagePopup
        open={isRemovePopupOpen}
        onClose={handleCloseRemovePopup}
        onSubmit={handleConfirmRemoval}
      />
      {!isPrimaryUiType && (
        <>
          {hasSizeError && (
            <IncorrectFilePopup
              popupVisible={hasSizeError}
              onClose={() => setError(null)}
              uiType={UploadFileError.Size}
              fileType={MediaType.Image}
            />
          )}
          {hasFormatError && (
            <IncorrectFilePopup
              popupVisible={hasFormatError}
              onClose={() => setError(null)}
              uiType={UploadFileError.Format}
              fileType={MediaType.Image}
            />
          )}
        </>
      )}
    </>
  );
};
