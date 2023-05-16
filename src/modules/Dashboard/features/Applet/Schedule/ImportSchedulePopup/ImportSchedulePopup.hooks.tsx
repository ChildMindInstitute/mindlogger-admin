import { useState } from 'react';

import { ImportedFile } from 'shared/components';

import { ImportScheduleErrors, ImportScheduleHookProps } from './ImportSchedulePopup.types';
import {
  getInvalidActivitiesError,
  getInvalidError,
  getUploadedScheduleErrors,
} from './ImportSchedulePopup.utils';

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
      hasInvalidStartTimeField,
      hasInvalidEndTimeField,
      hasInvalidNotification,
      hasInvalidFrequency,
      hasInvalidDate,
      hasInvalidStartEndTime,
      hasInvalidNotificationTime,
    } = getUploadedScheduleErrors(scheduleExportData, file?.data) || {};

    if (notExistentActivities?.length) {
      return setValidationError(getInvalidActivitiesError(notExistentActivities, appletName));
    }

    if (hasInvalidStartTimeField) {
      return setValidationError(getInvalidError(ImportScheduleErrors.StartTime));
    }

    if (hasInvalidEndTimeField) {
      return setValidationError(getInvalidError(ImportScheduleErrors.EndTime));
    }

    if (hasInvalidNotification) {
      return setValidationError(getInvalidError(ImportScheduleErrors.NotificationTime));
    }

    if (hasInvalidFrequency) {
      return setValidationError(getInvalidError(ImportScheduleErrors.Frequency));
    }

    if (hasInvalidDate) {
      return setValidationError(getInvalidError(ImportScheduleErrors.Date));
    }

    if (hasInvalidStartEndTime) {
      return setValidationError(getInvalidError(ImportScheduleErrors.StartEndTime));
    }

    if (hasInvalidNotificationTime) {
      return setValidationError(getInvalidError(ImportScheduleErrors.BetweenStartEndTime));
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
