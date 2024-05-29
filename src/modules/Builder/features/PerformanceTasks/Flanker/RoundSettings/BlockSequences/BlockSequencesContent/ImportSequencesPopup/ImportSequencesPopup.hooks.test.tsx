import { act, renderHook } from '@testing-library/react';

import { useImportSequence } from './ImportSequencesPopup.hooks';

describe('useImportSequence', () => {
  const uploadedImages = { value1: 'id1', '42': 'id42' };

  test('should initialize with correct initial values', () => {
    const { result } = renderHook(() => useImportSequence({}));

    expect(result.current.isSubmitDisabled).toBe(true);
    expect(result.current.uploadedData).toBeNull();
    expect(result.current.validationError).toBeNull();
  });

  test('should update state correctly when file is ready', () => {
    const { result } = renderHook(() => useImportSequence(uploadedImages));

    act(() => {
      result.current.handleFileReady({
        name: 'mock-file.csv',
        data: [{ key1: 'value1', key2: 42 }],
      });
    });

    expect(result.current.uploadedData).toEqual([
      { key1: { id: 'id1', text: 'value1' }, key2: { id: 'id42', text: '42' } },
    ]);
    expect(result.current.isSubmitDisabled).toBe(false);
    expect(result.current.validationError).toBeNull();
  });

  test('should update state correctly when file is null', () => {
    const { result } = renderHook(() => useImportSequence(uploadedImages));

    act(() => {
      result.current.handleFileReady(null);
    });

    expect(result.current.uploadedData).toBeNull();
    expect(result.current.isSubmitDisabled).toBe(true);
    expect(result.current.validationError).toBe(null);
  });

  test('should update state correctly when file is ready with invalid data', () => {
    const { result } = renderHook(() => useImportSequence(uploadedImages));

    act(() => {
      result.current.handleFileReady({
        name: 'mock-file.csv',
        data: [{ key1: '' }],
      });
    });

    expect(result.current.uploadedData).toBeNull();
    expect(result.current.isSubmitDisabled).toBe(true);
    expect(result.current.validationError).toBe(
      'File can not be uploaded. Please ensure stimulus screens have been uploaded prior to the block sequences and ensure the image name is the same as the file name uploaded.',
    );
  });
});
