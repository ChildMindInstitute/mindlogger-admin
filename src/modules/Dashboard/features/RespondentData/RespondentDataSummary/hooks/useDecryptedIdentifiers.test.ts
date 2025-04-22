import { renderHook } from '@testing-library/react';

import { applet } from 'shared/state/Applet';
import { mockedApplet, mockedAppletId, mockedIdentifiers, mockedPrivateKey } from 'shared/mock';
import { Identifier as IdentifierResponse } from 'api';

import { Identifier } from '../../RespondentData.types';
import { useDecryptedIdentifiers } from './useDecryptedIdentifiers';

const mockedUseParams = vi.fn();

vi.mock('react-router-dom', async () => {
  // pull in the real implementation
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');

  return {
    ...actual,
    useParams: () => mockedUseParams,
  };
});

jest.mock('shared/hooks/useEncryptionStorage', () => ({
  useEncryptionStorage: () => ({
    getAppletPrivateKey: () => mockedPrivateKey,
  }),
}));

describe('useDecryptedIdentifiers', () => {
  test('should return null when useAppletData is null', async () => {
    vi.spyOn(applet, 'useAppletData').mockReturnValue(null);
    mockedUseParams.mockReturnValue({ appletId: mockedAppletId });

    const { result } = renderHook(useDecryptedIdentifiers);

    expect(await result.current).toEqual(null);
  });

  test('should return an array of identifiers for decrypted data (userPublicKey: null)', async () => {
    vi.spyOn(applet, 'useAppletData').mockReturnValue({ result: mockedApplet });
    mockedUseParams.mockReturnValue({ appletId: mockedAppletId });

    const identifiers = [
      {
        identifier: 'Identifier_1',
        userPublicKey: null,
        lastAnswerDate: '2023-09-26T12:11:46.162083',
      },
      {
        identifier: 'Identifier_2',
        userPublicKey: null,
        lastAnswerDate: '2023-09-27T11:11:00.162083',
      },
    ];

    const { result } = renderHook(useDecryptedIdentifiers);
    const getDecryptedIdentifiers = result.current as (
      identifiers: IdentifierResponse[],
    ) => Promise<Identifier[]>;

    const decryptedIdentifiers = await getDecryptedIdentifiers(identifiers);

    expect(decryptedIdentifiers).toEqual([
      {
        decryptedValue: 'Identifier_1',
        encryptedValue: 'Identifier_1',
        lastAnswerDate: '2023-09-26T12:11:46.162083',
      },
      {
        decryptedValue: 'Identifier_2',
        encryptedValue: 'Identifier_2',
        lastAnswerDate: '2023-09-27T11:11:00.162083',
      },
    ]);
  });

  test('should return an array of identifiers for encrypted data', async () => {
    vi.spyOn(applet, 'useAppletData').mockReturnValue({ result: mockedApplet });
    mockedUseParams.mockReturnValue({ appletId: mockedAppletId });

    const { result } = renderHook(useDecryptedIdentifiers);
    const getDecryptedIdentifiers = result.current as (
      identifiers: IdentifierResponse[],
    ) => Promise<Identifier[]>;

    const decryptedIdentifiers = await getDecryptedIdentifiers(
      mockedIdentifiers as IdentifierResponse[],
    );

    expect(decryptedIdentifiers).toEqual([
      {
        decryptedValue: 'Test User',
        encryptedValue: '09a0bbf7994d5cf408292d7fb35dce18:e8051724b3f422950c1b0eb9c7013c72',
        lastAnswerDate: '2023-09-26T12:11:46.162083',
      },
      {
        decryptedValue: 'Jane Doe',
        encryptedValue: 'd0aa7af502fd96704585bee074786497:7f619511aaefa1bad1f5af6b3ef22d9b',
        lastAnswerDate: '2023-09-27T12:00:01.162083',
      },
    ]);
  });
});
