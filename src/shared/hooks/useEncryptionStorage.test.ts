import { renderHook } from '@testing-library/react';
import { vi } from 'vitest';

import { auth } from 'modules/Auth/state';
import { mockedAppletId, mockedPrivateKey, mockedUserData } from 'shared/mock';
import { Path } from 'shared/utils';

import { getEncryptionStorageKey, useEncryptionStorage } from './useEncryptionStorage';

const EMPTY_PRIVATE_KEY = '';

const mockedUseParams = vi.fn();
const mockedUseCheckIfNewApplet = vi.fn();

vi.mock('react-router-dom', async () => {
  // pull in the real implementation
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');

  return {
    ...actual,
    useParams: () => mockedUseParams,
  };
});

vi.mock('shared/hooks/useCheckIfNewApplet', () => ({
  useCheckIfNewApplet: () => mockedUseCheckIfNewApplet(),
}));

const spyUseData = vi.spyOn(auth, 'useData');

describe('useEncryptionStorage', () => {
  beforeEach(() => {
    sessionStorage.clear();

    spyUseData.mockReturnValue({ user: mockedUserData });
    mockedUseParams.mockReturnValue({ appletId: mockedAppletId });
    mockedUseCheckIfNewApplet.mockReturnValue(false);
  });

  test('getAppletPrivateKey works correctly', () => {
    const { result } = renderHook(useEncryptionStorage);
    result.current.setAppletPrivateKey(mockedAppletId, mockedPrivateKey);

    expect(result.current.getAppletPrivateKey(mockedAppletId)).toStrictEqual(mockedPrivateKey);
  });

  test('setAppletPrivateKey works correctly', () => {
    const { result } = renderHook(useEncryptionStorage);

    result.current.setAppletPrivateKey(mockedAppletId, mockedPrivateKey);

    const key = getEncryptionStorageKey(mockedUserData.id, mockedAppletId);

    expect(sessionStorage.getItem(key)).toBe(JSON.stringify(mockedPrivateKey));
  });

  test.each`
    appletId          | ownerId              | isNewApplet | expected             | description
    ${Path.NewApplet} | ${mockedUserData.id} | ${true}     | ${EMPTY_PRIVATE_KEY} | ${'getAppletPrivateKey returns empty string if applet is new'}
    ${mockedAppletId} | ${''}                | ${false}    | ${EMPTY_PRIVATE_KEY} | ${'getAppletPrivateKey returns empty string if there is no ownerId'}
    ${''}             | ${mockedUserData.id} | ${false}    | ${EMPTY_PRIVATE_KEY} | ${'getAppletPrivateKey returns empty string if there is no appletId'}
    ${mockedAppletId} | ${mockedUserData.id} | ${false}    | ${null}              | ${"getAppletPrivateKey returns null if applet hasn't opened yet"}
  `('$description', ({ appletId, ownerId, isNewApplet, expected }) => {
    mockedUseParams.mockReturnValue({ appletId });
    spyUseData.mockReturnValue({ user: { ...mockedUserData, id: ownerId } });
    mockedUseCheckIfNewApplet.mockReturnValue(isNewApplet);

    const { result } = renderHook(useEncryptionStorage);

    expect(result.current.getAppletPrivateKey(appletId)).toBe(expected);
  });

  test('getAppletPrivateKey clears previously set value if error appears while trying to JSON.parse', () => {
    vi.spyOn(JSON, 'parse').mockImplementationOnce(() => {
      throw new Error();
    });

    const { result } = renderHook(useEncryptionStorage);
    result.current.setAppletPrivateKey(mockedAppletId, mockedPrivateKey);

    const key = getEncryptionStorageKey(mockedUserData.id, mockedAppletId);
    result.current.getAppletPrivateKey(mockedAppletId);

    expect(sessionStorage.getItem(key)).toBe(null);
  });

  test('getAppletPrivateKey returns empty string if error appears while trying to JSON.parse', () => {
    vi.spyOn(JSON, 'parse').mockImplementationOnce(() => {
      throw new Error();
    });

    const { result } = renderHook(useEncryptionStorage);

    expect(result.current.getAppletPrivateKey(mockedAppletId)).toBe(EMPTY_PRIVATE_KEY);
  });

  test.each`
    appletId          | privateKey          | ownerId              | expected     | description
    ${''}             | ${mockedPrivateKey} | ${mockedUserData.id} | ${undefined} | ${"setAppletPrivateKey doesn't set private key if there is no appletId"}
    ${mockedAppletId} | ${mockedPrivateKey} | ${''}                | ${undefined} | ${"setAppletPrivateKey doesn't set private key if there is no ownerId"}
    ${mockedAppletId} | ${undefined}        | ${mockedUserData.id} | ${undefined} | ${"setAppletPrivateKey doesn't set private key if there is no privateKey"}
  `('$description', ({ appletId, privateKey, ownerId }) => {
    spyUseData.mockReturnValue({ user: { ...mockedUserData, id: ownerId } });

    const { result } = renderHook(useEncryptionStorage);

    result.current.setAppletPrivateKey(appletId, privateKey);

    const key = getEncryptionStorageKey(appletId, privateKey);

    expect(sessionStorage.getItem(key)).toBe(null);
  });

  test('setAppletPrivateKey removes previously set value if no privateKey provided', () => {
    const { result } = renderHook(useEncryptionStorage);

    result.current.setAppletPrivateKey(mockedAppletId, mockedPrivateKey);

    const key = getEncryptionStorageKey(mockedUserData.id, mockedAppletId);

    /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
    //@ts-ignore
    result.current.setAppletPrivateKey(mockedAppletId, undefined);
    expect(sessionStorage.getItem(key)).toBe(null);
  });
});
