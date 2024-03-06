import axios, { AxiosError } from 'axios';

import { ApiResponseCodes, MediaUploadFields } from 'shared/api';

import { CheckFileExists, FileUploadToBucket, GetFormDataToUpload } from './useMediaUpload.types';
import { COUNT_TO_STOP_RECURSION, TIMEOUT_TO_CHECK_MEDIA_IN_BUCKET } from './useMediaUpload.const';

export const uploadFileToS3 = ({ body, uploadUrl }: FileUploadToBucket) =>
  axios.post(uploadUrl, body, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const getFormDataToUpload = ({ file, fields }: GetFormDataToUpload) => {
  const body = new FormData();
  Object.keys(fields).forEach((key) => {
    body.append(key, fields[key as keyof MediaUploadFields]);
  });
  body.append('file', file);

  return body;
};

export const checkFileExists = async ({
  url,
  onSuccess,
  onError,
  onStopRecursion,
}: CheckFileExists) => {
  let timeoutId: NodeJS.Timeout;
  let count = 0;

  const check = async () => {
    // In case of an unpredictable situation where the file does not upload for a very long period
    if (count === COUNT_TO_STOP_RECURSION) {
      onStopRecursion?.();

      return;
    }

    try {
      await axios.head(url);
      onSuccess();
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === ApiResponseCodes.Forbidden) {
        timeoutId = setTimeout(check, TIMEOUT_TO_CHECK_MEDIA_IN_BUCKET);
        count++;

        return;
      }

      onError(axiosError);
    }
  };

  timeoutId = setTimeout(check, 0);

  return {
    stopChecking: () => {
      clearTimeout(timeoutId);
    },
  };
};
