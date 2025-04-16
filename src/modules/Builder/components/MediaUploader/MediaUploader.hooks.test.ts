import { ChangeEvent, MutableRefObject, DragEvent } from 'react';
import { renderHook } from '@testing-library/react';

import { useMediaUploader } from './MediaUploader.hooks';

const mockOnUpload = vi.fn();
const mockedExecuteMediaUpload = vi.fn();
const uploadError = 'Upload failed';
jest.mock('shared/hooks/useMediaUpload', () => ({
  useMediaUpload: () => ({
    executeMediaUpload: mockedExecuteMediaUpload,
    error: uploadError,
  }),
}));
const file = new File(['file contents'], 'test.mp3', { type: 'audio/mpeg' });

const testSuccessFlow = (result: { current: { error: string } }) => {
  expect(result.current.error).toBe('');
  expect(mockOnUpload).toHaveBeenCalledWith({ name: 'test.mp3', uploaded: false });
  expect(mockOnUpload).toHaveBeenCalledTimes(1);
  expect(mockedExecuteMediaUpload).toHaveBeenCalledWith({ file, fileName: 'test.mp3' });
};

const testErrorFlow = () => {
  expect(mockOnUpload).not.toHaveBeenCalled();
  expect(mockedExecuteMediaUpload).not.toHaveBeenCalled();
};

describe('useMediaUploader', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('should upload file on valid selection', async () => {
    const { result, rerender } = renderHook(() => useMediaUploader({ onUpload: mockOnUpload }));
    const event = { target: { files: [file] } } as unknown as ChangeEvent<HTMLInputElement>;

    result.current.handleChange(event);
    rerender();

    testSuccessFlow(result);
  });

  test('should handle error on invalid file size', async () => {
    const { result, rerender } = renderHook(() => useMediaUploader({ onUpload: mockOnUpload }));
    const event = {
      target: { files: [{ ...file, size: 190_286_400 }] },
    } as unknown as ChangeEvent<HTMLInputElement>;

    result.current.handleChange(event);
    rerender();

    expect(result.current.error).toBe('audioExceedSize');
    testErrorFlow();
  });

  test('should handle error on invalid file format', () => {
    const { result, rerender } = renderHook(() => useMediaUploader({ onUpload: mockOnUpload }));
    const newFile = new File(['file contents'], 'test.txt', { type: 'text/plain' });
    const event = { target: { files: [newFile] } } as unknown as ChangeEvent<HTMLInputElement>;

    result.current.handleChange(event);
    rerender();

    expect(result.current.error).toBe('audioWrongFormat');
    testErrorFlow();
  });

  test('should remove file and reset input on remove', () => {
    const { result } = renderHook(() => useMediaUploader({ onUpload: mockOnUpload }));
    const mockRefObject = {
      current: {
        value: 'test-value',
      },
    } as unknown as MutableRefObject<HTMLInputElement>;

    (result.current.uploadInputRef as MutableRefObject<HTMLInputElement>).current =
      mockRefObject.current;
    result.current.onRemove();
    expect(mockOnUpload).toHaveBeenCalledWith(null);
    result.current.uploadInputRef.current &&
      expect(result.current.uploadInputRef.current.value).toBe('');
  });

  test('should handle file drop', () => {
    const { result } = renderHook(() => useMediaUploader({ onUpload: mockOnUpload }));
    const event = {
      dataTransfer: { files: [file] },
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
    } as unknown as DragEvent<HTMLElement>;

    result.current.dragEvents.onDrop(event);

    testSuccessFlow(result);
  });

  test('should return upload error if useMediaUpload returns error', async () => {
    const { result } = renderHook(() => useMediaUploader({ onUpload: mockOnUpload }));

    expect(result.current.uploadError).toBe(uploadError);
  });
});
