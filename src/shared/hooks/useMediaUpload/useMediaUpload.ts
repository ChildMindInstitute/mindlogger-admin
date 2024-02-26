import { useState } from 'react';
import { AxiosError } from 'axios';

import { ApiResponseCodes, postFileUploadUrlApi } from 'shared/api';
import { useAsync } from 'shared/hooks/useAsync';

import { checkFileExists, getFormDataToUpload, uploadFileToS3 } from './useMediaUpload.utils';
import {
  ExecuteMediaUploadProps,
  UseMediaUploadProps,
  UseMediaUploadReturn,
} from './useMediaUpload.types';

export const useMediaUpload = ({
  callback,
  errorCallback,
  finallyCallback,
}: UseMediaUploadProps): UseMediaUploadReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [mediaUrl, setMediaUrl] = useState<null | string>(null);
  const [error, setError] = useState<AxiosError | null>(null);

  const handleError = (error: AxiosError) => {
    setError(error);
    errorCallback?.(error);
    setIsLoading(false);
  };

  const { execute: getMediaUploadUrl } = useAsync(postFileUploadUrlApi, undefined, (error) => {
    if (!error) return;

    handleError(error);
  });

  const executeMediaUpload = async ({ file, fileName }: ExecuteMediaUploadProps) => {
    try {
      setIsLoading(true);
      setMediaUrl(null);
      setError(null);

      const uploadUrlResponse = await getMediaUploadUrl(fileName);
      const uploadResult = uploadUrlResponse?.data?.result;
      if (!uploadResult) return;

      const { url, uploadUrl, fields } = uploadResult;
      const body = getFormDataToUpload({ file, fields });

      const uploadToS3Result = await uploadFileToS3({
        body,
        uploadUrl,
      });

      if (uploadToS3Result?.status === ApiResponseCodes.NoContent) {
        const successCallback = () => {
          setMediaUrl(url);
          callback?.(url);
          setIsLoading(false);
        };

        await checkFileExists({
          url,
          onSuccess: successCallback,
          onError: handleError,
        });
      }
    } catch (error) {
      if (!error) return;

      handleError(error as AxiosError);
    } finally {
      finallyCallback?.();
    }
  };

  return {
    executeMediaUpload,
    isLoading,
    mediaUrl,
    error,
  };
};
