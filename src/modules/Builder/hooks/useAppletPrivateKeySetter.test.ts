import { renderHook } from '@testing-library/react';
import { vi } from 'vitest';

import {
  mockedAppletId,
  mockedEncryption,
  mockedPassword,
  mockedPrivateKey2,
  mockedUserData,
} from 'shared/mock';
import { auth } from 'modules/Auth/state';
import * as sharedUtils from 'shared/utils';

import { useAppletPrivateKeySetter } from './useAppletPrivateKeySetter';

const mockedSetAppletPrivateKey = vi.fn();

vi.spyOn(auth, 'useData').mockReturnValue({ user: mockedUserData });

vi.mock('shared/utils', async (importOriginal) => {
  const actual = await importOriginal();

  return {
    ...actual,
    getParsedEncryptionFromServer: vi.fn(),
    getAppletEncryptionInfo: vi.fn(),
  };
});

vi.mock('shared/hooks', async (importOriginal) => {
  const actual = await importOriginal();

  return {
    ...actual,
    useEncryptionStorage: () => ({
      setAppletPrivateKey: mockedSetAppletPrivateKey,
    }),
  };
});

describe('useAppletPrivateKeySetter', () => {
  const mockedGetParsedEncryptionFromServer = vi.mocked(sharedUtils.getParsedEncryptionFromServer);
  const mockedGetAppletEncryptionInfo = vi.mocked(sharedUtils.getAppletEncryptionInfo);

  beforeEach(() => {
    mockedSetAppletPrivateKey.mockClear();
    mockedGetParsedEncryptionFromServer.mockClear();
    mockedGetAppletEncryptionInfo.mockClear();
  });

  test.each`
    appletId          | appletPassword    | encryption          | expected                               | description
    ${undefined}      | ${undefined}      | ${undefined}        | ${undefined}                           | ${"doesn't set private key if every argument missed"}
    ${mockedAppletId} | ${''}             | ${mockedEncryption} | ${undefined}                           | ${"doesn't set private key if appletPassword is empty"}
    ${undefined}      | ${mockedPassword} | ${mockedEncryption} | ${undefined}                           | ${"doesn't set private key if appletId is empty"}
    ${mockedAppletId} | ${mockedPassword} | ${undefined}        | ${undefined}                           | ${"doesn't set private key if encryption is empty"}
    ${mockedAppletId} | ${mockedPassword} | ${mockedEncryption} | ${[mockedAppletId, mockedPrivateKey2]} | ${'sets private key if everything is provided'}
  `('$description', async ({ appletId, appletPassword, encryption, expected }) => {
    // Setup mocks based on test case
    if (encryption) {
      mockedGetParsedEncryptionFromServer.mockReturnValue({
        publicKey: [1, 2, 3],
        prime: [4, 5, 6],
        base: [7, 8, 9],
        accountId: 'mockAccountId',
      });
      mockedGetAppletEncryptionInfo.mockResolvedValue({
        getPrivateKey: () => mockedPrivateKey2,
      } as any);
    } else {
      mockedGetParsedEncryptionFromServer.mockReturnValue(null);
    }

    const { result } = renderHook(useAppletPrivateKeySetter);

    await result.current({ appletId, appletPassword, encryption });

    expected
      ? expect(mockedSetAppletPrivateKey).toBeCalledWith(...expected)
      : expect(mockedSetAppletPrivateKey).not.toBeCalled();
  });
});
