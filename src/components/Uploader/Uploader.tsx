import { useState } from 'react';
import { Box, Button } from '@mui/material';
import { Trans } from 'react-i18next';

import { StyledBodyLarge } from 'styles/styledComponents/Typography';
import { Svg } from 'components/Svg';

import {
  StyledContainer,
  StyledLabel,
  StyledTextField,
  StyledImgContainer,
  StyledUploadImg,
  StyledButtonGroup,
  UploadedImgContainer,
} from './Uploader.styles';
import { UploaderProps } from './Uploader.types';

export const Uploader = ({ width, height }: UploaderProps) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isMouseOver, setIsMouseOver] = useState<boolean>(false);
  const stopDefaults = (e: React.DragEvent | React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
  };

  const dragEvents = {
    onMouseEnter: () => setIsMouseOver(true),
    onMouseLeave: () => setIsMouseOver(false),
    onDragEnter: stopDefaults,
    onDragLeave: stopDefaults,
    onDragOver: stopDefaults,
    onDrop: (e: React.DragEvent<HTMLElement>) => {
      stopDefaults(e);
      if (e.dataTransfer.files[0]) {
        setImageUrl(URL.createObjectURL(e.dataTransfer.files[0]));
      }
    },
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.[0]) {
      setImageUrl(URL.createObjectURL(event.target.files?.[0]));
    }
  };

  const onEditImg = () => {
    setImageUrl(null);
  };

  const onRemoveImg = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    stopDefaults(e);
    setImageUrl(null);
  };

  return (
    <Box>
      <StyledLabel
        {...dragEvents}
        label={
          <StyledContainer width={width} height={height} isImgUploaded={!!imageUrl}>
            {imageUrl ? (
              <UploadedImgContainer>
                <StyledUploadImg
                  alt="file upload"
                  src={imageUrl}
                  width={width}
                  height={height}
                  isMouseOver={isMouseOver}
                />
                {isMouseOver && (
                  <StyledButtonGroup variant="outlined" aria-label="button group">
                    <Button
                      startIcon={<Svg width="18" height="18" id="edit" />}
                      onClick={onEditImg}
                    />
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
        }
        control={
          <StyledTextField
            onChange={handleChange}
            inputProps={{ accept: 'image/png, image/jpg' }}
            type="file"
            name="uploadFile"
          />
        }
      />
    </Box>
  );
};
