import { AxiosError } from 'axios';

import { MediaUploadFields } from 'shared/api';

export type UseMediaUploadProps = {
  callback?: (mediaUrl: string) => void;
  errorCallback?: (error: AxiosError) => void;
  finallyCallback?: () => void;
};

export type ExecuteMediaUploadProps = { file: File; fileName: string };

export type FileUploadToBucket = {
  body: FormData;
  uploadUrl: string;
};

export type GetFormDataToUpload = { file: File; fields: MediaUploadFields };
