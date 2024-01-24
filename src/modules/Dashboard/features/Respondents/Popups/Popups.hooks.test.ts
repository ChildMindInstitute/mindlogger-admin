/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { renderHook } from '@testing-library/react';

import { mockedAppletId, mockedPrivateKey } from 'shared/mock';
import * as useEncryptionStorageHook from 'shared/hooks/useEncryptionStorage';

import { useCheckIfHasEncryption } from './Popups.hooks';

const callbackMock = jest.fn();

describe('useCheckIfHasEncryption', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should call callback and return true if hasEncryptionCheck is true', () => {
    jest.spyOn(useEncryptionStorageHook, 'useEncryptionStorage').mockReturnValue({
      getAppletPrivateKey: () => mockedPrivateKey,
    });
    const { result } = renderHook(() =>
      useCheckIfHasEncryption({
        isAppletSetting: true,
        appletData: { id: mockedAppletId },
        callback: callbackMock,
      }),
    );

    expect(callbackMock).toHaveBeenCalledTimes(1);
    expect(result.current).toBe(true);
  });

  test('should not call callback and return false if hasEncryptionCheck is false', () => {
    jest.spyOn(useEncryptionStorageHook, 'useEncryptionStorage').mockReturnValue({
      getAppletPrivateKey: () => undefined,
    });
    const { result } = renderHook(() =>
      useCheckIfHasEncryption({
        isAppletSetting: true,
        appletData: { id: mockedAppletId },
        callback: callbackMock,
      }),
    );

    expect(callbackMock).not.toHaveBeenCalled();
    expect(result.current).toBe(false);
  });

  test('should not call callback and return true if appletData is null, and hasEncryptionCheck is true', () => {
    jest.spyOn(useEncryptionStorageHook, 'useEncryptionStorage').mockReturnValue({
      getAppletPrivateKey: () => mockedPrivateKey,
    });
    const { result } = renderHook(() =>
      useCheckIfHasEncryption({
        isAppletSetting: false,
        appletData: null,
        callback: callbackMock,
      }),
    );

    expect(callbackMock).not.toHaveBeenCalled();
    expect(result.current).toBe(true);
  });
});
