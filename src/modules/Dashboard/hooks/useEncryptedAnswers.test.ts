import { renderHook } from '@testing-library/react';
import { vi } from 'vitest';
import * as routerDom from 'react-router-dom';

import { auth } from 'redux/modules';
import { AnswerDTO } from 'shared/types';
import { applet } from 'shared/state';
import { mockedApplet, mockedPrivateKey, mockedUserData } from 'shared/mock';

import { useEncryptedAnswers } from './useEncryptedAnswers';

vi.mock('react-router-dom', async () => {
  // pull in the real implementation
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');

  return {
    ...actual,
    useParams: () => vi.fn(),
  };
});

vi.mock('shared/utils', async (importOriginal) => {
  const actual = await importOriginal<typeof import('shared/utils')>();

  return {
    ...actual,
    getParsedEncryptionFromServer: vi.fn((encryption) => {
      if (!encryption) return null;

      return {
        publicKey: [1, 2, 3],
        prime: [4, 5, 6],
        base: [7, 8, 9],
        accountId: 'mockAccountId',
      };
    }),
    getAESKey: vi.fn(() => Promise.resolve('mocked-aes-key')),
    encryptData: vi.fn(({ text }) => Promise.resolve(`encrypted:${text}`)),
  };
});

vi.mock('shared/hooks/useEncryptionStorage', () => ({
  useEncryptionStorage: () => ({
    getAppletPrivateKey: () => mockedPrivateKey,
  }),
}));

describe('useEncryptedAnswers', () => {
  test('should return null when useAppletData is null', () => {
    vi.spyOn(auth, 'useData').mockReturnValue({ user: mockedUserData });
    vi.spyOn(applet, 'useAppletData').mockReturnValue(null);
    vi.spyOn(routerDom, 'useParams').mockReturnValue({ appletId: 'new-applet' });

    const { result } = renderHook(useEncryptedAnswers);

    expect(result.current).toEqual(null);
  });

  test('should return encrypted string', async () => {
    vi.spyOn(auth, 'useData').mockReturnValue({ user: mockedUserData });
    vi.spyOn(applet, 'useAppletData').mockReturnValue({ result: mockedApplet });
    vi.spyOn(routerDom, 'useParams').mockReturnValue({ appletId: 'new-applet' });

    const { result } = renderHook(useEncryptedAnswers);
    const encryptAnswers = result.current as (answers: AnswerDTO[]) => Promise<string>;

    const answers = [
      {
        value: '0',
        edited: 1698078909133,
      },
      {
        value: ['1', '3', '0'],
        edited: 1698078909134,
      },
      {
        value: 1,
        edited: 1698078909134,
      },
    ];

    const encryptedAnswers = await encryptAnswers(answers as AnswerDTO[]);
    expect(typeof encryptedAnswers).toBe('string');
  });
});
