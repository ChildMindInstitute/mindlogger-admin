import { AxiosError } from 'axios';

import { MediaUploadFields, TargetExtension } from 'shared/api';

export type UseMediaUploadProps = {
  callback?: (mediaUrl: string) => void;
  errorCallback?: (error: AxiosError) => void;
  finallyCallback?: () => void;
  onStopCallback?: () => void;
};

export type ExecuteMediaUploadProps = {
  file: File;
  fileName: string;
  targetExtension?: TargetExtension;
};

export type UseMediaUploadReturn = {
  error: null | AxiosError;
  executeMediaUpload: (props: ExecuteMediaUploadProps) => Promise<void>;
  isLoading: boolean;
  mediaUrl: string | null;
  stopUpload: () => void;
};

export type FileUploadToBucket = {
  body: FormData;
  uploadUrl: string;
};

export type GetFormDataToUpload = { file: File; fields: MediaUploadFields };

export type CheckFileExists = {
  url: string;
  onSuccess: () => void;
  onError: (error: AxiosError) => void;
  onStopRecursion?: () => void;
};
