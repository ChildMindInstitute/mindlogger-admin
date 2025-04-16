import { renderHook, act } from '@testing-library/react';
import axios from 'axios';

import { waitForTheUpdate } from 'shared/utils/testUtils';
import { TargetExtension } from 'shared/api';

import { useMediaUpload } from './useMediaUpload';
import { UseMediaUploadReturn } from './useMediaUpload.types';

const mockedAxios = axios.create();
const mockGetMediaUploadUrl = vi.fn();
jest.mock('shared/hooks/useAsync', () => ({
  useAsync: () => ({ execute: mockGetMediaUploadUrl }),
}));
const mockCallback = vi.fn();
const mockErrorCallback = vi.fn();
const mockFinallyCallback = vi.fn();
const url = 'https://example.com/image.jpg';
const uploadUrl = 'https://example.com/upload';
const file = new File(['file contents'], 'test.jpg', { type: 'image/jpeg' });
const fileName = 'test.jpg';
const uploadUrlResponse = {
  data: {
    result: {
      url,
      uploadUrl,
      fields: {
        key: 'test-key',
        policy: 'test-policy',
        signature: 'test-signature',
        'x-amz-security-token': 'test-token',
      },
    },
  },
};
const useMediaUploadProps = {
  callback: mockCallback,
  errorCallback: mockErrorCallback,
  finallyCallback: mockFinallyCallback,
};

const testUploadFlow = async (
  result: { current: UseMediaUploadReturn },
  targetExtension?: TargetExtension,
) => {
  act(() => {
    result.current.executeMediaUpload({ file, fileName, targetExtension });
  });

  expect(result.current.isLoading).toBe(true);

  await waitForTheUpdate();

  expect(mockGetMediaUploadUrl).toHaveBeenCalledWith({ fileName, targetExtension });
  expect(mockedAxios.post).toHaveBeenCalledWith(uploadUrl, expect.any(FormData), {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  jest.runAllTimers();
  await waitForTheUpdate();

  expect(result.current.isLoading).toBe(false);
};

const testErrorFlow = (result: { current: UseMediaUploadReturn }, message: string) => {
  expect(result.current.mediaUrl).toBe(null);
  expect(result.current.error?.message).toBe(message);
  expect(mockCallback).not.toHaveBeenCalled();
  expect(mockErrorCallback).toHaveBeenCalledWith(result.current.error);
  expect(mockFinallyCallback).toHaveBeenCalled();
};

const testSuccessUpload = async (targetExtension?: TargetExtension) => {
  const { result } = renderHook(() => useMediaUpload(useMediaUploadProps));

  mockGetMediaUploadUrl.mockResolvedValue(uploadUrlResponse);
  jest.spyOn(mockedAxios, 'post').mockResolvedValueOnce({ status: 204 });
  jest.spyOn(mockedAxios, 'head').mockResolvedValueOnce({ status: 200 });

  await testUploadFlow(result, targetExtension);

  expect(result.current.mediaUrl).toBe(url);
  expect(mockCallback).toHaveBeenCalledWith(url);
  expect(mockErrorCallback).not.toHaveBeenCalled();
  expect(mockFinallyCallback).toHaveBeenCalled();
};

describe('useMediaUpload', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  test('should upload file and set mediaUrl on successful upload', async () => testSuccessUpload());

  test('should upload file with target extension', async () =>
    testSuccessUpload(TargetExtension.MP4));

  test('should handle upload failure and call errorCallback', async () => {
    const { result } = renderHook(() => useMediaUpload(useMediaUploadProps));
    const message = 'Upload failed';
    mockGetMediaUploadUrl.mockResolvedValue(uploadUrlResponse);

    jest.spyOn(mockedAxios, 'post').mockRejectedValueOnce(new Error(message));

    await testUploadFlow(result);
    testErrorFlow(result, message);
  });

  test('should handle the bucket failure and call errorCallback', async () => {
    const { result } = renderHook(() => useMediaUpload(useMediaUploadProps));
    const message = 'Network error';

    mockGetMediaUploadUrl.mockResolvedValue(uploadUrlResponse);
    jest.spyOn(mockedAxios, 'post').mockResolvedValueOnce({ status: 204 });
    jest.spyOn(mockedAxios, 'head').mockRejectedValueOnce(new Error(message));

    await testUploadFlow(result);
    testErrorFlow(result, message);
  });
});
