import { renderHook } from '@testing-library/react';

import { auth } from 'modules/Auth/state';
import { mockedAppletId, mockedPrivateKey, mockedUserData } from 'shared/mock';

import { useEncryptionStorage } from './useEncryptionStorage';

const EMPTY_PRIVATE_KEY = '';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
}));

jest.spyOn(auth, 'useData').mockReturnValue({ user: mockedUserData });

describe('useEncryptionStorage', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  test('private key is empty if applet is new', () => {
    jest.mock('shared/hooks/useCheckIfNewApplet', () => true);

    const { result } = renderHook(useEncryptionStorage);

    expect(result.current.getAppletPrivateKey('')).toBe(EMPTY_PRIVATE_KEY);
  });

  test('private key is empty for applet hasn\'t opened yet', () => {
    const { result } = renderHook(useEncryptionStorage);

    expect(result.current.getAppletPrivateKey('')).toBe(EMPTY_PRIVATE_KEY);
  });

  test('private key stores correctly', () => {
    const { result } = renderHook(useEncryptionStorage);

    result.current.setAppletPrivateKey(mockedAppletId, mockedPrivateKey);

    expect(result.current.getAppletPrivateKey(mockedAppletId)).toStrictEqual(mockedPrivateKey);
  });
});
