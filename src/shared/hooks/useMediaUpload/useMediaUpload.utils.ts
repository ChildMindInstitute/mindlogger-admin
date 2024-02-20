import axios from 'axios';

import { MediaUploadFields } from 'shared/api';

import { FileUploadToBucket, GetFormDataToUpload } from './useMediaUpload.types';

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
