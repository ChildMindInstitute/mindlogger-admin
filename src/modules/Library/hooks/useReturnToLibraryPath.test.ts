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

vi.mock('shared/utils', async (importOriginal) => {
  const actual = await importOriginal();

  return {
    ...actual,
    storage: {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
    },
  };
});

describe('useReturnToLibraryPath', () => {
  beforeEach(() => {
    vi.clearAllMocks();
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
