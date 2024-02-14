import { MediaUploadFields, postFileUploadUrlApi } from 'shared/api';
import { useAsync } from 'shared/hooks/useAsync';

export type ExecuteMediaUploadProps = { fileData: FormData; fileName: string };
export type FileUploadToBucket = MediaUploadFields & { file: FormData; Bucket: string };

export const useMediaUpload = () => {
  const { execute: getMediaUploadUrl, isLoading: mediaUploadUrlLoading } = useAsync(
    postFileUploadUrlApi,
    (response) => console.log('result', response?.data?.result),
  );

  const uploadFileToS3 = async (params: FileUploadToBucket) => {
    // try {
    //   const response = await s3.upload(params).promise();
    //   console.log('File uploaded successfully:', response.Location);
    //
    //   return response.Location; // Return the URL of the uploaded file
    // } catch (error) {
    //   console.error('Error uploading file:', error);
    //   throw error;
    // }
  };

  const executeMediaUpload = async ({ fileData, fileName }: ExecuteMediaUploadProps) => {
    try {
      const uploadUrlResponse = await getMediaUploadUrl(fileName);
      const uploadResult = uploadUrlResponse?.data?.result;
      if (!uploadResult) return;
    } catch (error) {
      console.warn(error);
    }
  };

  return {
    executeMediaUpload,
    isLoading: mediaUploadUrlLoading,
  };
};
