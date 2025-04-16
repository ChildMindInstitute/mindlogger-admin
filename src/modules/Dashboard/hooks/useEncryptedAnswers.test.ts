import { renderHook } from '@testing-library/react';
import * as routerDom from 'react-router-dom';

import { auth } from 'redux/modules';
import { AnswerDTO } from 'shared/types';
import { applet } from 'shared/state';
import { mockedApplet, mockedPrivateKey, mockedUserData } from 'shared/mock';

import { useEncryptedAnswers } from './useEncryptedAnswers';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: vi.fn(),
}));

jest.mock('shared/hooks/useEncryptionStorage', () => ({
  useEncryptionStorage: () => ({
    getAppletPrivateKey: () => mockedPrivateKey,
  }),
}));

describe('useEncryptedAnswers', () => {
  test('should return null when useAppletData is null', () => {
    jest.spyOn(auth, 'useData').mockReturnValue({ user: mockedUserData });
    jest.spyOn(applet, 'useAppletData').mockReturnValue(null);
    jest.spyOn(routerDom, 'useParams').mockReturnValue({ appletId: 'new-applet' });

    const { result } = renderHook(useEncryptedAnswers);

    expect(result.current).toEqual(null);
  });

  test('should return encrypted string', async () => {
    jest.spyOn(auth, 'useData').mockReturnValue({ user: mockedUserData });
    jest.spyOn(applet, 'useAppletData').mockReturnValue({ result: mockedApplet });
    jest.spyOn(routerDom, 'useParams').mockReturnValue({ appletId: 'new-applet' });

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
