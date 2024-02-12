import { renderHook } from '@testing-library/react';
import * as routerDom from 'react-router-dom';

import { Identifier as IdentifierResponse } from 'api';
import { applet } from 'shared/state';
import { mockedApplet, mockedIdentifiers, mockedPrivateKey } from 'shared/mock';
import { Identifier } from 'modules/Dashboard/features/RespondentData/RespondentDataSummary/RespondentDataSummary.types';

import { useDecryptedIdentifiers } from './useDecryptedIdentifiers';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
}));

jest.mock('shared/hooks/useEncryptionStorage', () => ({
  useEncryptionStorage: () => ({
    getAppletPrivateKey: () => mockedPrivateKey,
  }),
}));

describe('useDecryptedIdentifiers', () => {
  test('should return null when useAppletData is null', async () => {
    jest.spyOn(applet, 'useAppletData').mockReturnValue(null);
    jest.spyOn(routerDom, 'useParams').mockReturnValue({ appletId: 'new-applet' });

    const { result } = renderHook(useDecryptedIdentifiers);

    expect(await result.current).toEqual(null);
  });

  test('should return an array of identifiers for decrypted data (userPublicKey: null)', async () => {
    jest.spyOn(applet, 'useAppletData').mockReturnValue({ result: mockedApplet });
    jest.spyOn(routerDom, 'useParams').mockReturnValue({ appletId: 'new-applet' });

    const identifiers = [
      {
        identifier: 'Identifier_1',
        userPublicKey: null,
      },
      {
        identifier: 'Identifier_2',
        userPublicKey: null,
      },
    ];

    const { result } = renderHook(useDecryptedIdentifiers);
    const getDecryptedIdentifiers = result.current as (identifiers: IdentifierResponse[]) => Promise<Identifier[]>;

    const decryptedIdentifiers = await getDecryptedIdentifiers(identifiers);

    expect(decryptedIdentifiers).toEqual([
      {
        decryptedValue: 'Identifier_1',
        encryptedValue: 'Identifier_1',
      },
      {
        decryptedValue: 'Identifier_2',
        encryptedValue: 'Identifier_2',
      },
    ]);
  });

  test('should return an array of identifiers for encrypted data', async () => {
    jest.spyOn(applet, 'useAppletData').mockReturnValue({ result: mockedApplet });
    jest.spyOn(routerDom, 'useParams').mockReturnValue({ appletId: 'new-applet' });

    const { result } = renderHook(useDecryptedIdentifiers);
    const getDecryptedIdentifiers = result.current as (identifiers: IdentifierResponse[]) => Promise<Identifier[]>;

    const decryptedIdentifiers = await getDecryptedIdentifiers(mockedIdentifiers as IdentifierResponse[]);

    expect(decryptedIdentifiers).toEqual([
      {
        decryptedValue: 'Test User',
        encryptedValue: '09a0bbf7994d5cf408292d7fb35dce18:e8051724b3f422950c1b0eb9c7013c72',
      },
      {
        decryptedValue: 'Jane Doe',
        encryptedValue: 'd0aa7af502fd96704585bee074786497:7f619511aaefa1bad1f5af6b3ef22d9b',
      },
    ]);
  });
});
