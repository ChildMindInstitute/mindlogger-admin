import { authStorage } from './authStorage';
import { LocalStorageKeys, storage } from './storage';

describe('authStorage', () => {
  beforeEach(() => vi.clearAllMocks());

  // The store picks the key to delete from the value's type, which it reads from a snapshot taken
  // when the tab loaded. Without the write, a workspace another tab left behind outlives the logout.
  it('writes a workspace before removing it, so one left by another tab goes too', () => {
    authStorage.removeWorkspace();

    expect(storage.setItem).toHaveBeenCalledWith(LocalStorageKeys.Workspace, {});
    expect(storage.removeItem).toHaveBeenCalledWith(LocalStorageKeys.Workspace);
    expect(vi.mocked(storage.setItem).mock.invocationCallOrder[0]).toBeLessThan(
      vi.mocked(storage.removeItem).mock.invocationCallOrder[0],
    );
  });

  it('clears the workspace the same way on logout', () => {
    authStorage.clear();

    expect(storage.setItem).toHaveBeenCalledWith(LocalStorageKeys.Workspace, {});
    expect(storage.removeItem).toHaveBeenCalledWith(LocalStorageKeys.Workspace);
  });

  it('clears both tokens on logout', () => {
    authStorage.clear();

    expect(storage.removeItem).toHaveBeenCalledWith(LocalStorageKeys.AccessToken);
    expect(storage.removeItem).toHaveBeenCalledWith(LocalStorageKeys.RefreshToken);
  });

  // Signing out is not a reason to forget the chosen language or where the library was left.
  it('leaves everything else in the store alone', () => {
    authStorage.clear();

    expect(storage.removeItem).not.toHaveBeenCalledWith(LocalStorageKeys.Language);
    expect(storage.removeItem).not.toHaveBeenCalledWith(LocalStorageKeys.LibraryUrl);
  });
});
