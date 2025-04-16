import { renderHook } from '@testing-library/react';

import { MAX_FILE_SIZE_25MB, MediaType } from 'shared/consts';

import { useUploadMethods } from './Extensions.hooks';
import * as utils from './Extensions.utils';
import { UploadMethodsProps } from './Extensions.types';

const mockedExecuteMediaUpload = vi.fn();
jest.mock('shared/hooks/useMediaUpload', () => ({
  ...jest.requireActual('shared/hooks/useMediaUpload'),
  useMediaUpload: () => ({
    executeMediaUpload: mockedExecuteMediaUpload,
    isLoading: false,
  }),
}));

const setPopupVisibleAndSetError = async (props: UploadMethodsProps) => {
  vi.spyOn(utils, 'checkImgUrl').mockImplementationOnce(() => Promise.resolve(false));
  const { result, rerender } = renderHook(() => useUploadMethods(props));
  expect(result.current.sourceError).toBe('');
  expect(result.current.isPopupVisible).toBeFalsy();

  await result.current.handlePopupSubmit({
    label: 'label',
    address: 'failed address',
  });
  rerender();
  expect(result.current.sourceError).toBe('invalidLink');
  result.current.onAddLinkClick();
  rerender();
  expect(result.current.isPopupVisible).toBeTruthy();

  return {
    result,
    rerender,
  };
};

describe('Extensions.hooks', () => {
  const mockedInsertHandler = vi.fn();
  const mockedSetFileSizeExceeded = vi.fn();
  const mockedSetIncorrectFormat = vi.fn();
  const mockedSetIsLoading = vi.fn();
  const props = {
    fileSizeExceeded: MAX_FILE_SIZE_25MB,
    type: MediaType.Image,
    insertHandler: mockedInsertHandler,
    setFileSizeExceeded: mockedSetFileSizeExceeded,
    setIncorrectFormat: mockedSetIncorrectFormat,
    setIsLoading: mockedSetIsLoading,
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('should return default result', () => {
    const { result } = renderHook(() => useUploadMethods(props));

    expect(result.current).toStrictEqual({
      handlePopupClose: expect.any(Function),
      handlePopupSubmit: expect.any(Function),
      inputRef: {
        current: null,
      },
      isPopupVisible: false,
      isVisible: false,
      onAddLinkClick: expect.any(Function),
      onInputChange: expect.any(Function),
      onUploadClick: expect.any(Function),
      setIsVisible: expect.any(Function),
      sourceError: '',
    });
  });

  test('should set invalid link error on submit', async () => {
    vi.spyOn(utils, 'checkImgUrl').mockImplementationOnce(() => Promise.resolve(false));
    const { result, rerender } = renderHook(() => useUploadMethods(props));
    expect(result.current.sourceError).toBe('');

    await result.current.handlePopupSubmit({
      label: 'label',
      address: 'failed address',
    });

    rerender();

    expect(result.current.sourceError).toEqual('invalidLink');
  });

  test('should trigger insert handler on submit when url is valid', async () => {
    const { result, rerender } = await setPopupVisibleAndSetError(props);
    expect(mockedInsertHandler).toBeCalledTimes(0);

    vi.spyOn(utils, 'checkImgUrl').mockImplementationOnce(() => Promise.resolve(true));
    const succeedFormData = {
      label: 'label',
      address: 'succeed address',
    };
    await result.current.handlePopupSubmit(succeedFormData);

    rerender();

    expect(result.current.sourceError).toBe('');
    expect(result.current.isPopupVisible).toBeFalsy();
    expect(mockedInsertHandler).toBeCalledTimes(1);
    expect(mockedInsertHandler).toBeCalledWith(succeedFormData);
  });

  test('should check triggers within handlePopupClose', async () => {
    const { result, rerender } = await setPopupVisibleAndSetError(props);
    result.current.handlePopupClose();

    rerender();

    expect(result.current.sourceError).toBe('');
    expect(result.current.isPopupVisible).toBeFalsy();
  });

  test('should check triggers within onAddLinkClick', async () => {
    const { result, rerender } = renderHook(() => useUploadMethods(props));
    expect(result.current.isPopupVisible).toBeFalsy();

    result.current.onAddLinkClick();

    rerender();

    expect(result.current.isPopupVisible).toBeTruthy();
  });

  test('should check triggers within onUploadClick', async () => {
    const mockedClick = vi.fn();
    const { result, rerender } = renderHook(() => useUploadMethods(props));
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    result.current.inputRef.current = {
      click: mockedClick,
    };
    expect(mockedClick).toBeCalledTimes(0);

    rerender();

    result.current.onUploadClick();
    expect(mockedClick).toBeCalledTimes(1);
  });

  test('should check triggers when file size exceeded', async () => {
    const { result } = renderHook(() => useUploadMethods(props));
    result.current.inputRef.current = {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      files: [
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        {
          name: 'uploaded_file',
          size: MAX_FILE_SIZE_25MB,
        },
      ],
    };

    result.current.onInputChange();
    expect(mockedSetFileSizeExceeded).toBeCalledWith(MAX_FILE_SIZE_25MB);
  });

  test('should check triggers when valid file format', async () => {
    const { result } = renderHook(() => useUploadMethods(props));
    result.current.inputRef.current = {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      files: [
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        {
          name: 'uploaded_file.png',
          size: MAX_FILE_SIZE_25MB - 1,
        },
      ],
    };

    result.current.onInputChange();
    expect(mockedExecuteMediaUpload).toBeCalledWith({
      file: {
        name: 'uploaded_file.png',
        size: 26214399,
      },
      fileName: 'uploaded_file.png',
    });
  });

  test.each([
    [MediaType.Image, '.png', 0],
    [MediaType.Image, '.jpg', 0],
    [MediaType.Image, '.jpeg', 0],
    [MediaType.Image, '.wrong_image_format', 1],
    [MediaType.Audio, '.mp3', 0],
    [MediaType.Audio, '.wav', 0],
    [MediaType.Audio, '.wrong_audio_format', 1],
    [MediaType.Video, '.webm', 0],
    [MediaType.Video, '.mp4', 0],
    [MediaType.Video, '.wrong_video_format', 1],
  ])('check %s-file with "%s" format', (type, format, expectedCallTimes) => {
    const { result } = renderHook(() =>
      useUploadMethods({
        ...props,
        type,
      }),
    );
    result.current.inputRef.current = {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      files: [
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        {
          name: `uploaded_file.${format}`,
          size: MAX_FILE_SIZE_25MB - 1,
        },
      ],
    };

    result.current.onInputChange();

    expect(mockedSetIncorrectFormat).toBeCalledTimes(expectedCallTimes);
    if (expectedCallTimes) {
      expect(mockedSetIncorrectFormat).toBeCalledWith(type);
    }
  });
});
