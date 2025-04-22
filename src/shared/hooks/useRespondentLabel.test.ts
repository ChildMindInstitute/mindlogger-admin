import { renderHook } from '@testing-library/react';
import * as routerDom from 'react-router-dom';

import { users } from 'redux/modules';
import { getRespondentName } from 'shared/utils';

import { useRespondentLabel } from './useRespondentLabel';

vi.mock('react-router-dom', async () => {
  // pull in the real implementation
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');

  return {
    ...actual,
    useParams: () => vi.fn(),
  };
});

describe('useRespondentLabel', () => {
  test('should return an empty string when respondentId is not provided', () => {
    vi.spyOn(routerDom, 'useParams').mockReturnValue({ respondentId: undefined });
    users.useRespondent = vi.fn().mockReturnValue({ details: undefined });
    users.useSubject = vi.fn().mockReturnValue({ details: undefined });

    const { result } = renderHook(useRespondentLabel);

    expect(result.current).toBe('');
  });

  test('should return an empty string when details are not available', () => {
    vi.spyOn(routerDom, 'useParams').mockReturnValue({ respondentId: '123' });
    users.useRespondent = vi.fn().mockReturnValue({ details: undefined });
    users.useSubject = vi.fn().mockReturnValue({ details: undefined });

    const { result } = renderHook(useRespondentLabel);

    expect(result.current).toBe('');
  });

  test('should construct and return the respondent label correctly (Respondent: secret123)', () => {
    vi.spyOn(routerDom, 'useParams').mockReturnValue({ respondentId: '123' });
    const res = {
      secretUserId: 'secret123',
      nickname: '',
    };

    users.useRespondent = vi.fn().mockReturnValue({ result: res });
    users.useSubject = vi.fn().mockReturnValue({ details: undefined });

    const { result } = renderHook(useRespondentLabel);

    expect(result.current).toBe('Respondent: secret123');
  });

  test('should construct and return the subject label correctly for subject (User: secret123)', () => {
    vi.spyOn(routerDom, 'useParams').mockReturnValue({ respondentId: '123' });
    const res = {
      secretUserId: 'subject123',
      nickname: '',
    };

    users.useSubject = vi.fn().mockReturnValue({ result: res });
    users.useRespondent = vi.fn().mockReturnValue({ details: undefined });

    const { result } = renderHook(() => useRespondentLabel({ isSubject: true }));

    expect(result.current).toBe('Subject: subject123');
  });

  test('should construct and return the respondent label correctly (User: secret123 (John Doe))', () => {
    vi.spyOn(routerDom, 'useParams').mockReturnValue({ respondentId: '123' });
    const res = {
      secretUserId: 'secret123',
      nickname: 'John Doe',
    };
    users.useRespondent = vi.fn().mockReturnValue({ result: res });
    users.useSubject = vi.fn().mockReturnValue({ details: undefined });

    const { result } = renderHook(useRespondentLabel);

    expect(result.current).toBe('Respondent: secret123 (John Doe)');
  });

  test('should construct and return the respondent without the label (secret123 (John Doe))', () => {
    vi.spyOn(routerDom, 'useParams').mockReturnValue({ respondentId: '123' });
    const res = {
      secretUserId: 'secret123',
      nickname: 'John Doe',
      firstName: 'John',
      lastName: 'Doe',
      id: '123',
      lastSeen: '2024-04-10T10:00:00',
      userId: '123',
    };

    users.useRespondent = vi.fn().mockReturnValue({ result: res });
    users.useSubject = vi.fn().mockReturnValue({ details: undefined });

    const { result } = renderHook(() => getRespondentName(res.secretUserId, res.nickname));

    expect(result.current).toBe('secret123 (John Doe)');
  });
});
