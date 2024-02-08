import { Fragment, useState } from 'react';

import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { ImportedFile } from 'shared/components';

import { commonErrorBoxProps } from './ImportSchedule.const';
import { ImportScheduleHookProps } from './ImportSchedulePopup.types';
import { getInvalidActivitiesError, getUploadedScheduleErrors } from './ImportSchedulePopup.utils';

export const useImportSchedule = ({ appletName, scheduleExportData }: ImportScheduleHookProps) => {
  const { t } = useTranslation('app');
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<null | ImportedFile>(null);
  const [validationError, setValidationError] = useState<JSX.Element | null>(null);

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

    const { notExistentActivities, hasInvalidData, ...otherErrors } =
      getUploadedScheduleErrors(scheduleExportData, file?.data) || {};

    if (hasInvalidData || notExistentActivities?.length) {
      const invalidErrors = (
        <>
          {!!notExistentActivities?.length && getInvalidActivitiesError(notExistentActivities, appletName)}
          {hasInvalidData && (
            <>
              <Box {...commonErrorBoxProps}>{t('importScheduleErrors.invalidDataFormat')}</Box>
              {Object.values(otherErrors).map(({ data, id }) => data && <Fragment key={id}>{data}</Fragment>)}
              <Box {...commonErrorBoxProps}>{t('importScheduleErrors.updateReupload')}</Box>
            </>
          )}
        </>
      );

      return setValidationError(invalidErrors);
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
