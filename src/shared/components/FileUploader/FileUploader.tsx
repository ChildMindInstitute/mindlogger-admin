import { useState, ChangeEvent, DragEvent } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Box, Button } from '@mui/material';

import {
  StyledBodyLarge,
  StyledFlexAllCenter,
  StyledFlexTopCenter,
  StyledLabelBoldLarge,
  StyledTitleSmall,
  theme,
  variables,
} from 'shared/styles';

import {
  StyledButton,
  StyledLabel,
  StyledLinearProgress,
  StyledSvg,
  StyledTextField,
} from './FileUploader.styles';
import { FileUploaderProps, ImportedFile } from './FileUploader.types';
import { Svg } from '../Svg';
import { importTable } from './FileUploader.utils';

export const FileUploader = ({
  uploadLabel,
  onFileReady,
  invalidFileFormatError,
}: FileUploaderProps) => {
  const { t } = useTranslation();

  const [file, setFile] = useState<null | ImportedFile>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<JSX.Element | null>(null);

  const handleChange = async (event: DragEvent | ChangeEvent) => {
    setIsLoading(true);

    const files =
      (event as ChangeEvent<HTMLInputElement>)?.target.files ||
      (event as DragEvent)?.dataTransfer.files;
    if (!files.length) {
      return;
    }
    const file = files[0];
    importTable(file)
      .then((data) => {
        setFile({ name: file.name, data });
        onFileReady(file);
        console.log(data);
      })
      .catch(() => setError(invalidFileFormatError));

    setTimeout(() => setIsLoading(false), 3000);
  };

  const removeFile = () => {
    setFile(null);
    onFileReady(null);
  };

  return (
    <>
      <StyledBodyLarge>{uploadLabel}</StyledBodyLarge>
      <Button
        sx={{ margin: theme.spacing(1.2, 0, 2.4, 0) }}
        variant="text"
        startIcon={<StyledSvg width="18" height="18" id="export" />}
      >
        {t('downloadTemplate')}
      </Button>
      <Box>
        {isLoading ? (
          <StyledLinearProgress />
        ) : (
          <>
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
                label={
                  <StyledFlexAllCenter>
                    <StyledBodyLarge>
                      <Trans i18nKey="dropFile">
                        Drop <strong>.csv, .xls, .xlsx</strong> or <strong>.ods</strong> here or{' '}
                        <em>click to browse</em>.
                      </Trans>
                    </StyledBodyLarge>
                  </StyledFlexAllCenter>
                }
                control={
                  <StyledTextField
                    onChange={handleChange}
                    inputProps={{ accept: '.csv, .xlsx, .xls, .ods' }}
                    type="file"
                    name="uploadFile"
                  />
                }
              />
            )}
          </>
        )}
      </Box>
      {error && (
        <StyledTitleSmall sx={{ mt: 2.2 }} color={variables.palette.semantic.error}>
          {error}
        </StyledTitleSmall>
      )}
    </>
  );
};
