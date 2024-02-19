import { renderHook, act } from '@testing-library/react';
import axios from 'axios';

import { useMediaUpload } from './useMediaUpload';
import { UseMediaUploadReturn } from './useMediaUpload.types';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockGetMediaUploadUrl = jest.fn();
jest.mock('shared/hooks/useAsync', () => ({
  useAsync: () => ({ execute: mockGetMediaUploadUrl }),
}));
const mockCallback = jest.fn();
const mockErrorCallback = jest.fn();
const mockFinallyCallback = jest.fn();
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

const testUploadFlow = async (result: { current: UseMediaUploadReturn }) => {
  act(() => {
    result.current.executeMediaUpload({ file, fileName });
  });

  expect(result.current.isLoading).toBe(true);

  // wait for the update
  await act(async () => {
    await Promise.resolve();
  });

  expect(mockGetMediaUploadUrl).toHaveBeenCalledWith(fileName);
  expect(mockedAxios.post).toHaveBeenCalledWith(uploadUrl, expect.any(FormData), {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  expect(result.current.isLoading).toBe(false);
};

describe('useMediaUpload', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should upload file and set mediaUrl on successful upload', async () => {
    const { result } = renderHook(() => useMediaUpload(useMediaUploadProps));

    mockGetMediaUploadUrl.mockResolvedValue(uploadUrlResponse);

    mockedAxios.post.mockResolvedValue({ status: 204 });

    await testUploadFlow(result);

    expect(result.current.mediaUrl).toBe(url);
    expect(mockCallback).toHaveBeenCalledWith(url);
    expect(mockErrorCallback).not.toHaveBeenCalled();
    expect(mockFinallyCallback).toHaveBeenCalled();
  });

  test('should handle upload failure and call errorCallback', async () => {
    const { result } = renderHook(() => useMediaUpload(useMediaUploadProps));

    mockGetMediaUploadUrl.mockResolvedValue(uploadUrlResponse);

    mockedAxios.post.mockRejectedValue(new Error('Upload failed'));

    await testUploadFlow(result);

    expect(result.current.mediaUrl).toBe(null);
    expect(result.current.error?.message).toBe('Upload failed');
    expect(mockCallback).not.toHaveBeenCalled();
    expect(mockErrorCallback).toHaveBeenCalledWith(result.current.error);
    expect(mockFinallyCallback).toHaveBeenCalled();
  });
});
