import { renderHook } from '@testing-library/react';
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

jest.mock('shared/hooks/useEncryptionStorage', () => ({
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
