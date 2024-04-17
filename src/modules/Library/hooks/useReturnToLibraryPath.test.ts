// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { storage, LocalStorageKeys } from 'shared/utils';
import { renderHookWithProviders } from 'shared/utils/renderHookWithProviders';

import { useReturnToLibraryPath } from './useReturnToLibraryPath';

const getPreloadedState = ({ isAuthorized }) => ({
  auth: {
    isAuthorized,
  },
});

jest.mock('shared/utils', () => ({
  ...jest.requireActual('shared/utils'),
  storage: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  },
}));

describe('useReturnToLibraryPath', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should remove item from storage if authorized', () => {
    const { result } = renderHookWithProviders(() => useReturnToLibraryPath('/library'), {
      preloadedState: getPreloadedState({ isAuthorized: true }),
    });

    expect(storage.removeItem).toHaveBeenCalledWith(LocalStorageKeys.LibraryUrl);
    expect(storage.setItem).not.toHaveBeenCalled();

    expect(result.current).toBeUndefined();
  });

  test('should set item in storage if not authorized', () => {
    const { result } = renderHookWithProviders(() => useReturnToLibraryPath('/library'), {
      preloadedState: getPreloadedState({ isAuthorized: false }),
    });

    expect(storage.setItem).toHaveBeenCalledWith(LocalStorageKeys.LibraryUrl, '/library');
    expect(storage.removeItem).not.toHaveBeenCalled();

    expect(result.current).toBeUndefined();
  });
});
