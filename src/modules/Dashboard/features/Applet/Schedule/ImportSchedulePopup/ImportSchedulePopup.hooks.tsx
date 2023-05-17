import { useState } from 'react';

import { ImportedFile } from 'shared/components';

import { ImportScheduleHookProps } from './ImportSchedulePopup.types';
import { getInvalidActivitiesError, getUploadedScheduleErrors } from './ImportSchedulePopup.utils';

export const useImportSchedule = ({ appletName, scheduleExportData }: ImportScheduleHookProps) => {
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

    const {
      notExistentActivities,
      invalidStartTimeField,
      invalidEndTimeField,
      invalidNotification,
      invalidFrequency,
      invalidDate,
      invalidStartEndTime,
      invalidNotificationTime,
    } = getUploadedScheduleErrors(scheduleExportData, file?.data) || {};

    if (notExistentActivities?.length) {
      return setValidationError(getInvalidActivitiesError(notExistentActivities, appletName));
    }

    const invalidError =
      invalidStartTimeField ||
      invalidEndTimeField ||
      invalidNotification ||
      invalidFrequency ||
      invalidDate ||
      invalidStartEndTime ||
      invalidNotificationTime;

    if (invalidError) {
      return setValidationError(invalidError);
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
