import { Box } from '@mui/material';
import { ChangeEvent, DragEvent, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Svg } from 'shared/components/Svg';
import {
  StyledBodyLarge,
  StyledBodyMedium,
  StyledFlexAllCenter,
  StyledFlexTopCenter,
  StyledLabelBoldLarge,
  StyledTitleSmall,
  theme,
  variables,
} from 'shared/styles';

import { DownloadTemplate } from './DownloadTemlate';
import { MimeType } from './FileUploader.const';
import { StyledButton, StyledLabel, StyledSvg, StyledTextField } from './FileUploader.styles';
import { FileUploaderProps, FileUploaderUiType, ImportedFile } from './FileUploader.types';
import { getAcceptedFormats, getDropText, importTable } from './FileUploader.utils';

export const FileUploader = ({
  uploadLabel,
  onFileReady,
  invalidFileFormatError,
  onDownloadTemplate,
  onDownloadSecond,
  downloadFirstText,
  downloadSecondText,
  validationError,
  parsingError,
  uiType = FileUploaderUiType.Primary,
  csvOnly,
}: FileUploaderProps) => {
  const { t } = useTranslation();

  const [file, setFile] = useState<null | ImportedFile>(null);
  const [error, setError] = useState<JSX.Element | string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>();
  const isPrimaryUiType = uiType === FileUploaderUiType.Primary;

  const stopDefaults = (e: DragEvent | MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
  };

  const dragEvents = {
    onDragEnter: stopDefaults,
    onDragLeave: stopDefaults,
    onDragOver: stopDefaults,
    onDrop: (e: DragEvent<HTMLElement>) => {
      stopDefaults(e);
      handleChange(e);
    },
  };

  const handleChange = async (event: DragEvent | ChangeEvent) => {
    const files =
      (event as ChangeEvent<HTMLInputElement>)?.target.files ||
      (event as DragEvent)?.dataTransfer.files;
    if (!files.length) {
      return;
    }

    const file = files[0];

    if (fileInputRef.current) fileInputRef.current.value = '';

    if (csvOnly && !file.type.includes(MimeType.Csv)) {
      setError(invalidFileFormatError);

      return;
    }

    importTable(file, isPrimaryUiType)
      .then((data) => {
        setError(null);
        const importedFile = { name: file.name, data };
        const hasError = onFileReady(importedFile);
        hasError ? setError(validationError!) : setFile(importedFile);
      })
      .catch(() => setError(parsingError || invalidFileFormatError));
  };

  const removeFile = () => {
    setError(null);
    setFile(null);
    onFileReady(null);
  };

  useEffect(() => {
    if (!validationError) return;

    setError(validationError);
    setFile(null);
    onFileReady(null);
  }, [validationError]);

  return (
    <>
      <StyledBodyLarge>{uploadLabel}</StyledBodyLarge>
      {(onDownloadTemplate || onDownloadSecond) && (
        <StyledFlexTopCenter>
          {onDownloadTemplate && (
            <DownloadTemplate
              sxProps={{ m: theme.spacing(1.2, 1.2, 2.4, 0) }}
              onClick={onDownloadTemplate}
            >
              {downloadFirstText ?? t('downloadTemplate')}
            </DownloadTemplate>
          )}
          {onDownloadSecond && (
            <DownloadTemplate
              sxProps={{ m: theme.spacing(1.2, 0, 2.4, 0) }}
              onClick={onDownloadSecond}
            >
              {downloadSecondText ?? t('downloadTemplate')}
            </DownloadTemplate>
          )}
        </StyledFlexTopCenter>
      )}
      <Box>
        {file ? (
          <StyledFlexTopCenter sx={{ ml: 2 }}>
            <StyledSvg id="check" width="18" height="18" />
            <StyledLabelBoldLarge sx={{ ml: 0.8 }} color={variables.palette.primary}>
              {file.name}
            </StyledLabelBoldLarge>
            <StyledButton onClick={removeFile}>
              <Svg id="cross" width="18" height="18" />
            </StyledButton>
          </StyledFlexTopCenter>
        ) : (
          <StyledLabel
            {...dragEvents}
            label={
              <StyledFlexAllCenter>
                <StyledBodyMedium sx={{ textAlign: 'center' }}>
                  {getDropText({ isPrimaryUiType, csvOnly })}
                </StyledBodyMedium>
              </StyledFlexAllCenter>
            }
            control={
              <StyledTextField
                inputRef={fileInputRef}
                onChange={handleChange}
                inputProps={{
                  accept: getAcceptedFormats({ isPrimaryUiType, csvOnly }),
                  'data-testid': 'upload-file-input',
                }}
                type="file"
                name="uploadFile"
              />
            }
          />
        )}
      </Box>
      {error && (
        <StyledTitleSmall sx={{ mt: 2.2 }} color={variables.palette.error}>
          {error}
        </StyledTitleSmall>
      )}
    </>
  );
};
