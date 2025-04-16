import { LocalStorageKeys, storage } from 'shared/utils/storage';

import { navigateToLibrary } from './navigateToLibrary';

describe('navigateToLibrary', () => {
  test('should navigate to the library URL when it is present in storage', () => {
    const fakeNavigate = vi.fn();
    const libraryUrl = 'https://example.com/library';

    const getItemMock = jest.spyOn(storage, 'getItem');
    getItemMock.mockReturnValue(libraryUrl);

    navigateToLibrary(fakeNavigate);

    expect(fakeNavigate).toHaveBeenCalledWith(libraryUrl);
    expect(storage.removeItem).toHaveBeenCalledWith(LocalStorageKeys.LibraryUrl);
  });

  test('should not navigate if the library URL is not present in storage', () => {
    const fakeNavigate = vi.fn();

    const getItemMock = jest.spyOn(storage, 'getItem');
    getItemMock.mockReturnValue(null);

    navigateToLibrary(fakeNavigate);

    expect(fakeNavigate).not.toHaveBeenCalled();
    expect(storage.removeItem).not.toHaveBeenCalled();
  });
});
