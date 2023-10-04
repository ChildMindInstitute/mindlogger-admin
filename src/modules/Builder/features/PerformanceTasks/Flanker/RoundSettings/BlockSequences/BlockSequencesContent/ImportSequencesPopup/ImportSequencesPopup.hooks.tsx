import { useState } from 'react';

import { ImportedFile } from 'shared/components';

import { getUploadedDataWithIds } from './ImportSequencesPopup.utils';
import { invalidFieldError } from './ImportSequencesPopup.const';
import { UploadedData, UploadedDataOrNull } from '../BlockSequencesContent.types';
import { UploadedImages } from './ImportSequencesPopup.types';

export const useImportSequence = (uploadedImages: UploadedImages) => {
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [uploadedData, setUploadedData] = useState<UploadedDataOrNull>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSuccessfullyUploaded = (file: UploadedData) => {
    setUploadedData(file);
    setIsSubmitDisabled(!file);
    setValidationError(null);
  };

  const handleUploadClear = () => {
    setUploadedData(null);
    setIsSubmitDisabled(true);
    setValidationError(null);
  };

  const handleFileReady = (file: ImportedFile | null) => {
    if (!file) return handleUploadClear();

    const { invalidData, uploadedDataWithIds } = getUploadedDataWithIds(file.data, uploadedImages);

    if (invalidData) {
      return setValidationError(invalidFieldError);
    }

    return handleSuccessfullyUploaded(uploadedDataWithIds);
  };

  return {
    isSubmitDisabled,
    setIsSubmitDisabled,
    uploadedData,
    validationError,
    setValidationError,
    handleFileReady,
  };
};
