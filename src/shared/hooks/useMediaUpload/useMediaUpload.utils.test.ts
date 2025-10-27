import axios from 'axios';
import { vi } from 'vitest';

import { MediaUploadFields } from 'shared/api';
import { waitForTheUpdate } from 'shared/utils/testUtils';

import { uploadFileToS3, getFormDataToUpload, checkFileExists } from './useMediaUpload.utils';

// Mock axios at the module level
vi.mock('axios');
const mockedAxios = vi.mocked(axios);

describe('useMediaUpload.utils', () => {
  describe('uploadFileToS3', () => {
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
      vi.spyOn(mockedAxios, 'post').mockImplementation(() =>
        Promise.reject(new Error('Upload failed')),
      );

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

  describe('checkFileExists', () => {
    const url = 'https://example.com/file.mp3';
    const mockedOnSuccess = vi.fn();
    const mockedOnError = vi.fn();
    const mockedOnStopRecursion = vi.fn();

    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.clearAllTimers();
      vi.restoreAllMocks();
      vi.clearAllMocks();
    });

    test('should call onSuccess when file exists', async () => {
      vi.spyOn(mockedAxios, 'head').mockResolvedValueOnce({ status: 200 });

      await checkFileExists({
        url,
        onSuccess: mockedOnSuccess,
        onError: mockedOnError,
        onStopRecursion: mockedOnStopRecursion,
      });

      vi.runAllTimers();

      await waitForTheUpdate();

      expect(mockedAxios.head).toHaveBeenCalledWith(url);
      expect(mockedOnSuccess).toHaveBeenCalled();
      expect(mockedOnError).not.toHaveBeenCalled();
      expect(mockedOnStopRecursion).not.toHaveBeenCalled();
    });

    test('should retry after a timeout if response status is Forbidden', async () => {
      vi.spyOn(mockedAxios, 'head').mockRejectedValueOnce({ response: { status: 403 } });
      const setTimeoutSpy = vi.spyOn(global, 'setTimeout');

      await checkFileExists({ url, onSuccess: mockedOnSuccess, onError: mockedOnError });

      vi.runAllTimers();

      expect(mockedAxios.head).toHaveBeenCalledWith(url);
      expect(setTimeoutSpy).toHaveBeenCalledTimes(1);
      expect(mockedOnSuccess).not.toHaveBeenCalled();
      expect(mockedOnError).not.toHaveBeenCalled();
    });

    test('should call onError when an error occurs', async () => {
      const error = new Error('Network error');
      vi.spyOn(mockedAxios, 'head').mockRejectedValueOnce(error);

      await checkFileExists({ url, onSuccess: mockedOnSuccess, onError: mockedOnError });

      vi.runAllTimers();

      await waitForTheUpdate();

      expect(mockedAxios.head).toHaveBeenCalledWith(url);
      expect(mockedOnSuccess).not.toHaveBeenCalled();
      expect(mockedOnError).toHaveBeenCalledWith(error);
    });

    test('should clear timeout when stopChecking is called', async () => {
      vi.spyOn(mockedAxios, 'head').mockRejectedValueOnce({ response: { status: 403 } });
      const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');

      const { stopChecking } = await checkFileExists({
        url,
        onSuccess: mockedOnSuccess,
        onError: mockedOnError,
        onStopRecursion: mockedOnStopRecursion,
      });

      stopChecking();

      expect(clearTimeoutSpy).toHaveBeenCalled();
    });
  });
});
