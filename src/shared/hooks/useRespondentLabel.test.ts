import { renderHook } from '@testing-library/react';
import * as routerDom from 'react-router-dom';

import { users } from 'redux/modules';

import { useRespondentLabel } from './useRespondentLabel';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
}));

describe('useRespondentLabel', () => {
  test('should return an empty string when respondentId is not provided', () => {
    jest.spyOn(routerDom, 'useParams').mockReturnValue({ respondentId: undefined });
    users.useRespondent = jest.fn().mockReturnValue({ details: undefined });
    users.useSubject = jest.fn().mockReturnValue({ details: undefined });

    const { result } = renderHook(useRespondentLabel);

    expect(result.current).toBe('');
  });

  test('should return an empty string when details are not available', () => {
    jest.spyOn(routerDom, 'useParams').mockReturnValue({ respondentId: '123' });
    users.useRespondent = jest.fn().mockReturnValue({ details: undefined });
    users.useSubject = jest.fn().mockReturnValue({ details: undefined });

    const { result } = renderHook(useRespondentLabel);

    expect(result.current).toBe('');
  });

  test('should construct and return the respondent label correctly (Respondent: secret123)', () => {
    jest.spyOn(routerDom, 'useParams').mockReturnValue({ respondentId: '123' });
    const res = {
      secretUserId: 'secret123',
      nickname: '',
    };

    users.useRespondent = jest.fn().mockReturnValue({ result: res });
    users.useSubject = jest.fn().mockReturnValue({ details: undefined });

    const { result } = renderHook(useRespondentLabel);

    expect(result.current).toBe('Respondent: secret123');
  });

  test('should construct and return the subject label correctly for subject (User: secret123)', () => {
    jest.spyOn(routerDom, 'useParams').mockReturnValue({ respondentId: '123' });
    const res = {
      secretUserId: 'subject123',
      nickname: '',
    };

    users.useSubject = jest.fn().mockReturnValue({ result: res });
    users.useRespondent = jest.fn().mockReturnValue({ details: undefined });

    const { result } = renderHook(() => useRespondentLabel({ isSubject: true }));

    expect(result.current).toBe('Subject: subject123');
  });

  test('should construct and return the respondent label correctly (User: secret123 (John Doe))', () => {
    jest.spyOn(routerDom, 'useParams').mockReturnValue({ respondentId: '123' });
    const res = {
      secretUserId: 'secret123',
      nickname: 'John Doe',
    };
    users.useRespondent = jest.fn().mockReturnValue({ result: res });
    users.useSubject = jest.fn().mockReturnValue({ details: undefined });

    const { result } = renderHook(useRespondentLabel);

    expect(result.current).toBe('Respondent: secret123 (John Doe)');
  });

  test('should construct and return the respondent without the label (secret123 (John Doe))', () => {
    jest.spyOn(routerDom, 'useParams').mockReturnValue({ respondentId: '123' });
    const res = {
      secretUserId: 'secret123',
      nickname: 'John Doe',
    };

    users.useRespondent = jest.fn().mockReturnValue({ result: res });
    users.useSubject = jest.fn().mockReturnValue({ details: undefined });

    const { result } = renderHook(() => useRespondentLabel({ hideLabel: true }));

    expect(result.current).toBe('secret123 (John Doe)');
  });
});
