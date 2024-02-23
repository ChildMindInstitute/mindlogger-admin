import { renderHook } from '@testing-library/react';

import {
  mockedAppletId,
  mockedEncryption,
  mockedPassword,
  mockedPrivateKey2,
  mockedUserData,
} from 'shared/mock';
import { auth } from 'modules/Auth/state';

import { useAppletPrivateKeySetter } from './useAppletPrivateKeySetter';

const mockedSetAppletPrivateKey = jest.fn();

jest.spyOn(auth, 'useData').mockReturnValue({ user: mockedUserData });
jest.mock('shared/hooks', () => ({
  ...jest.requireActual('shared/hooks'),
  useEncryptionStorage: () => ({
    setAppletPrivateKey: mockedSetAppletPrivateKey,
  }),
}));

describe('useAppletPrivateKeySetter', () => {
  test.each`
    appletId          | appletPassword    | encryption          | expected                               | description
    ${undefined}      | ${undefined}      | ${undefined}        | ${undefined}                           | ${"doesn't set private key if every argument missed"}
    ${mockedAppletId} | ${''}             | ${mockedEncryption} | ${undefined}                           | ${"doesn't set private key if appletPassword is empty"}
    ${undefined}      | ${mockedPassword} | ${mockedEncryption} | ${undefined}                           | ${"doesn't set private key if appletId is empty"}
    ${mockedAppletId} | ${mockedPassword} | ${undefined}        | ${undefined}                           | ${"doesn't set private key if encryption is empty"}
    ${mockedAppletId} | ${mockedPassword} | ${mockedEncryption} | ${[mockedAppletId, mockedPrivateKey2]} | ${'sets private key if everything is provided'}
  `('$description', async ({ appletId, appletPassword, encryption, expected }) => {
    const { result } = renderHook(useAppletPrivateKeySetter);

    await result.current({ appletId, appletPassword, encryption });

    expected
      ? expect(mockedSetAppletPrivateKey).toBeCalledWith(...expected)
      : expect(mockedSetAppletPrivateKey).not.toBeCalled();
  });
});
