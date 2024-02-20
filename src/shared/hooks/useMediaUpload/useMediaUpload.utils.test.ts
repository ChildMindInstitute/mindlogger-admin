import axios from 'axios';

import { MediaUploadFields } from 'shared/api';

import { uploadFileToS3, getFormDataToUpload } from './useMediaUpload.utils';

describe('uploadFileToS3', () => {
  const mockedAxios = axios.create();
  const uploadUrl = 'https://example.com/upload';
  const body = new FormData();

  test('should call axios.post with the correct arguments', async () => {
    await uploadFileToS3({ body, uploadUrl });

    expect(mockedAxios.post).toHaveBeenCalledTimes(1);
    expect(mockedAxios.post).toHaveBeenCalledWith(uploadUrl, body, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  });

  test('should throw an error if axios.post fails', async () => {
    jest
      .spyOn(mockedAxios, 'post')
      .mockImplementation(() => Promise.reject(new Error('Upload failed')));

    await expect(uploadFileToS3({ body, uploadUrl })).rejects.toThrow('Upload failed');
  });
});

describe('getFormDataToUpload', () => {
  const file = new File(['file contents'], 'test.jpg', { type: 'image/jpeg' });
  const fields = {
    AWSAccessKeyId: 'test-key-id',
    key: 'test-key',
    policy: 'test-policy',
    signature: 'test-signature',
    'x-amz-security-token': 'test-token',
  };

  test('should return a FormData object with the correct fields', () => {
    const result = getFormDataToUpload({ file, fields });

    expect(result instanceof FormData).toBe(true);
    Object.keys(fields).forEach((key) => {
      expect(result.get(key)).toBe(fields[key as keyof MediaUploadFields]);
    });

    // validate that the file is placed last in the FormData object
    const entries = Array.from(result.entries());
    const lastEntry = entries[entries.length - 1];
    expect(lastEntry[0]).toBe('file');
    expect(lastEntry[1]).toBe(file);
  });
});
