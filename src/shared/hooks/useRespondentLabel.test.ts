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

    const { result } = renderHook(useRespondentLabel);

    expect(result.current).toBe('');
  });

  test('should return an empty string when details are not available', () => {
    jest.spyOn(routerDom, 'useParams').mockReturnValue({ respondentId: '123' });
    users.useRespondent = jest.fn().mockReturnValue({ details: undefined });

    const { result } = renderHook(useRespondentLabel);

    expect(result.current).toBe('');
  });

  test('should construct and return the respondent label correctly (User: secret123)', () => {
    jest.spyOn(routerDom, 'useParams').mockReturnValue({ respondentId: '123' });
    const details = [
      {
        respondentSecretId: 'secret123',
        respondentNickname: '',
      },
    ];
    users.useRespondent = jest.fn().mockReturnValue({ details });

    const { result } = renderHook(useRespondentLabel);

    expect(result.current).toBe('User: secret123');
  });

  test('should construct and return the respondent label correctly (User: secret123 (John Doe))', () => {
    jest.spyOn(routerDom, 'useParams').mockReturnValue({ respondentId: '123' });
    const details = [
      {
        respondentSecretId: 'secret123',
        respondentNickname: 'John Doe',
      },
    ];
    users.useRespondent = jest.fn().mockReturnValue({ details });

    const { result } = renderHook(useRespondentLabel);

    expect(result.current).toBe('User: secret123 (John Doe)');
  });
});
