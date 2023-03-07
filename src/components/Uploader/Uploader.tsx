import { ChangeEvent, DragEvent, MouseEvent, useRef, useState } from 'react';
import { Button } from '@mui/material';
import { Trans } from 'react-i18next';

import { StyledBodyMedium } from 'styles/styledComponents';
import { CropPopup, Svg } from 'components';
import theme from 'styles/theme';

import { variables } from 'styles/variables';
import {
  StyledButtonGroup,
  StyledContainer,
  StyledImgContainer,
  StyledName,
  StyledNameWrapper,
  StyledUploadImg,
  UploadedImgContainer,
} from './Uploader.styles';
import { UploaderProps, UploaderUiType } from './Uploader.types';

const MAX_FILE_SIZE = 1073741824; //1GB

export const Uploader = ({
  uiType = UploaderUiType.Primary,
  width,
  height,
  setValue,
  getValue,
  description,
}: UploaderProps) => {
  const uploadInputRef = useRef<HTMLInputElement>(null);
  const [cropPopupVisible, setCropPopupVisible] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [isMouseOver, setIsMouseOver] = useState<boolean>(false);
  const [error, setError] = useState(false);
  const isPrimaryUiType = uiType === UploaderUiType.Primary;

  const stopDefaults = (e: DragEvent | MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
  };

  const handleSetImage = (files: FileList | null) => {
    if (files?.[0]) {
      const isAllowableSize = files[0].size < MAX_FILE_SIZE;

      setError(!isAllowableSize);

      if (isAllowableSize && files[0].type.includes('image')) {
        if (isPrimaryUiType) {
          setImage(files[0]);
          setCropPopupVisible(true);
        } else {
          const reader = new FileReader();
          reader.readAsDataURL(files[0]);

          reader.onload = () => {
            const imageUrl = reader.result;
            imageUrl && setValue(imageUrl as string);
          };
        }
      }
    }
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

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;

    handleSetImage(files);
  };

  const onEditImg = (e: MouseEvent) => {
    stopDefaults(e);
    uploadInputRef?.current?.click();
  };

  const onRemoveImg = (e: MouseEvent) => {
    stopDefaults(e);
    setImage(null);
    setValue('');
    if (uploadInputRef.current) {
      uploadInputRef.current.value = '';
    }
  };

  const imageField = getValue();

  const placeholderImgId = isPrimaryUiType ? 'img-filled' : 'img-outlined';
  const deleteBtnProps = {
    sx: isPrimaryUiType ? null : { width: '4.8rem', height: '4.8rem' },
  };

  return (
    <>
      <StyledContainer
        width={width}
        height={height}
        isImgUploaded={!!imageField}
        isPrimaryUiType={isPrimaryUiType}
        onClick={() => uploadInputRef?.current?.click()}
        {...dragEvents}
      >
        {imageField ? (
          <UploadedImgContainer>
            <StyledUploadImg alt="file upload" src={imageField} width={width} height={height} />
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
                <Button
                  {...deleteBtnProps}
                  startIcon={<Svg width="18" height="18" id="trash" />}
                  onClick={onRemoveImg}
                />
              </StyledButtonGroup>
            )}
          </UploadedImgContainer>
        ) : (
          <StyledImgContainer className="image-container" isPrimaryUiType={isPrimaryUiType}>
            <Svg id={placeholderImgId} width={32} height={32} />
            {isPrimaryUiType && error && (
              <StyledBodyMedium
                sx={{ marginBottom: theme.spacing(1) }}
                color={variables.palette.semantic.error}
              >
                <Trans i18nKey="dropError">
                  Image is more than <br /> 1GB.
                </Trans>
              </StyledBodyMedium>
            )}
            {isPrimaryUiType && (
              <StyledBodyMedium>
                <Trans i18nKey="dropImg">
                  Drop Image here <br /> or <span>click to browse</span>.
                </Trans>
              </StyledBodyMedium>
            )}
          </StyledImgContainer>
        )}
      </StyledContainer>
      <input
        ref={uploadInputRef}
        onChange={handleChange}
        accept="image/*"
        type="file"
        name="uploadFile"
        hidden
      />
      {isPrimaryUiType && (
        <StyledNameWrapper>
          {image?.name ? (
            <>
              <StyledName sx={{ marginRight: theme.spacing(0.4) }}>{image.name}</StyledName>{' '}
              <Svg id="check" width={18} height={18} />
            </>
          ) : (
            description
          )}
        </StyledNameWrapper>
      )}
      {cropPopupVisible && (
        <CropPopup
          open={cropPopupVisible}
          setCropPopupVisible={setCropPopupVisible}
          setValue={setValue}
          imageUrl={image ? URL.createObjectURL(image) : ''}
        />
      )}
    </>
  );
};
