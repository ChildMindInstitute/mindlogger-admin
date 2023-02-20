import { useState, DragEvent, MouseEvent, ChangeEvent, useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import { Button } from '@mui/material';
import { Trans, useTranslation } from 'react-i18next';

import { StyledBodyLarge, StyledBodyMedium } from 'styles/styledComponents';
import { Svg } from 'components';
import { CropPopup } from 'features/Builder/AboutApplet/CropPopup';
import { variables } from 'styles/variables';
import theme from 'styles/theme';

import { FormValues } from 'features/Builder/AboutApplet/AboutApplet.const';
import {
  StyledContainer,
  StyledImgContainer,
  StyledUploadImg,
  StyledButtonGroup,
  UploadedImgContainer,
} from './Uploader.styles';
import { UploaderProps } from './Uploader.types';

const MAX_FILE_SIZE = 1073741824;

export const Uploader = ({ width, height, name }: UploaderProps) => {
  const { t } = useTranslation('app');
  const uploadInputRef = useRef<HTMLInputElement>(null);
  const [cropPopupVisible, setCropPopupVisible] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [isMouseOver, setIsMouseOver] = useState<boolean>(false);

  const { watch, setValue } = useFormContext<FormValues>();

  const stopDefaults = (e: DragEvent | MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
  };

  const handleSetImage = (files: FileList | null) => {
    if (files?.[0] && files?.[0].size < MAX_FILE_SIZE) {
      setImage(files[0]);
      setCropPopupVisible(true);
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

  const onEditImg = () => {
    setImage(null);
    setValue(name, '');
  };

  const onRemoveImg = (e: MouseEvent) => {
    stopDefaults(e);
    setImage(null);
    setValue(name, '');
    if (uploadInputRef.current) {
      uploadInputRef.current.value = '';
    }
  };

  const imageField = watch(name);

  return (
    <>
      <StyledContainer
        width={width}
        height={height}
        isImgUploaded={!!imageField}
        onClick={() => uploadInputRef?.current?.click()}
        {...dragEvents}
      >
        {imageField ? (
          <UploadedImgContainer>
            <StyledUploadImg alt="file upload" src={imageField} width={width} height={height} />
            {isMouseOver && (
              <StyledButtonGroup variant="outlined" aria-label="button group">
                <Button startIcon={<Svg width="18" height="18" id="edit" />} onClick={onEditImg} />
                <Button
                  startIcon={<Svg width="18" height="18" id="trash" />}
                  onClick={onRemoveImg}
                />
              </StyledButtonGroup>
            )}
          </UploadedImgContainer>
        ) : (
          <StyledImgContainer>
            <Svg id="img-filled" width={18} height={18} />
            <StyledBodyLarge>
              <Trans i18nKey="dropImg">
                Drop Image here or <span>click to browse</span>.
              </Trans>
            </StyledBodyLarge>
          </StyledImgContainer>
        )}
      </StyledContainer>
      <input
        ref={uploadInputRef}
        onChange={handleChange}
        accept="image/png, image/jpg"
        type="file"
        name="uploadFile"
        hidden
      />
      {cropPopupVisible && (
        <CropPopup
          open={cropPopupVisible}
          setCropPopupVisible={setCropPopupVisible}
          name={name}
          setValue={setValue}
          imageUrl={image ? URL.createObjectURL(image) : ''}
        />
      )}
      {image?.name || (
        <StyledBodyMedium
          color={variables.palette.on_surface_variant}
          sx={{ marginTop: theme.spacing(1.6) }}
        >
          {t('uploadImg')}
        </StyledBodyMedium>
      )}
    </>
  );
};
