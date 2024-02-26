import axios, { AxiosError } from 'axios';

import { ApiResponseCodes, MediaUploadFields } from 'shared/api';

import { CheckFileExists, FileUploadToBucket, GetFormDataToUpload } from './useMediaUpload.types';
import { TIMEOUT_TO_CHECK_MEDIA_IN_BUCKET } from './useMediaUpload.const';

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

export const checkFileExists = async ({ url, onSuccess, onError }: CheckFileExists) => {
  try {
    await axios.head(url);
    onSuccess();
  } catch (error) {
    const axiosError = error as AxiosError;
    if (axiosError.response?.status === ApiResponseCodes.Forbidden) {
      setTimeout(() => {
        checkFileExists({ url, onSuccess, onError });
      }, TIMEOUT_TO_CHECK_MEDIA_IN_BUCKET);

      return;
    }

    onError(axiosError);
  }
};
