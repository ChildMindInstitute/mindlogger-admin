import { useState } from 'react';

import { ImportedFile } from 'shared/components';

import { hasUploadedFileError } from './ImportSequencesPopup.utils';
import { invalidFieldError } from './ImportSequencesPopup.const';

export const useImportSequence = (imageNames: string[]) => {
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [uploadedFile, setUploadedFile] = useState<null | ImportedFile>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSuccessfullyUploaded = (file: ImportedFile) => {
    setUploadedFile(file);
    setIsSubmitDisabled(!file);
  };

  const handleUploadClear = () => {
    setUploadedFile(null);
    setIsSubmitDisabled(true);
  };

  const handleFileReady = (file: ImportedFile | null) => {
    if (!file) return handleUploadClear();

    if (hasUploadedFileError(file.data, imageNames)) {
      return setValidationError(invalidFieldError);
    }

    return handleSuccessfullyUploaded(file);
  };

  return {
    isSubmitDisabled,
    setIsSubmitDisabled,
    uploadedFile,
    validationError,
    setValidationError,
    handleFileReady,
  };
};
